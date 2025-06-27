// backend/routes/webhook.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const db = require('../config/db');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Setup Email
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Fallback alert table for webhook errors
const logWebhookError = async (context, message, raw = '') => {
  console.error(`❌ [${context}] ${message}`);
  await db.promise().query(
    `INSERT INTO webhook_errors (context, message, raw_payload) VALUES (?, ?, ?)`,
    [context, message, JSON.stringify(raw)]
  );
};

// POST /api/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('📩 Webhook received');
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
    console.log(`✅ Verified Stripe event: ${event.type}`);
  } catch (err) {
    await logWebhookError('Verification', 'Invalid signature', req.body);
    return res.sendStatus(400);
  }

  try {
    // Log webhook event
    await db.promise().query(
      `INSERT INTO stripe_webhook_logs (event_type, payload) VALUES (?, ?)`,
      [event.type, JSON.stringify(event)]
    );
    console.log('🗂 Webhook logged to database');
  } catch (err) {
    await logWebhookError('Logging', err.message, event);
  }

  // Handle subscription completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const firstName = session.metadata?.firstName || 'Unknown';
    const lastName = session.metadata?.lastName || 'Unknown';
    const plan = session.metadata?.productId || 'unknown';
    let email = 'unknown@email.com';

    try {
      const customer = await stripe.customers.retrieve(session.customer);
      email = customer.email;
      console.log(`📧 Customer email: ${email}`);

      const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        await db.promise().query(
          `INSERT INTO users (first_name, last_name, email, stripe_customer_id, subscription_plan)
           VALUES (?, ?, ?, ?, ?)`,
          [firstName, lastName, email, session.customer, plan]
        );
        console.log(`🆕 New user created: ${email}`);
      } else {
        await db.promise().query(
          `UPDATE users SET stripe_customer_id = ?, subscription_plan = ? WHERE email = ?`,
          [session.customer, plan, email]
        );
        console.log(`🔁 Existing user updated: ${email}`);
      }

      // Update session status
      await db.promise().query(`UPDATE stripe_sessions SET status = 'completed' WHERE session_id = ?`, [session.id]);
      console.log('✅ Stripe session status updated');

      // Generate JWT and send login confirmation
      const [[userRow]] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      const token = jwt.sign({ id: userRow.id, email: userRow.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      console.log(`🔐 Token generated: ${token}`);

      // Send confirmation email with retry fallback
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Welcome to EMSForge',
          html: `<p>Hello ${firstName},</p><p>Your subscription to <strong>${plan}</strong> is active.</p><p>Click <a href="https://emsforge.com/dashboard?token=${token}">here</a> to get started.</p>`
        });
        console.log('📨 Confirmation email sent');
      } catch (err) {
        await logWebhookError('EmailSendFail', err.message, { email });
      }

      // Send alert to Discord webhook
      if (process.env.DISCORD_WEBHOOK_URL) {
        try {
          await axios.post(process.env.DISCORD_WEBHOOK_URL, {
            content: `✅ New EMSForge subscription: ${email} — Plan: ${plan}`
          });
          console.log('📣 Discord alert sent');
        } catch (err) {
          await logWebhookError('DiscordFail', err.message);
        }
      }

      // TODO: Add SMS logic if needed
    } catch (err) {
      await logWebhookError('MainHandler', err.message, event);
    }
  }

  // Handle subscription updates (pause/cancel)
  if ([
    'customer.subscription.updated',
    'customer.subscription.deleted'
  ].includes(event.type)) {
    try {
      const sub = event.data.object;
      await db.promise().query(`
        UPDATE users SET subscription_status = ? WHERE stripe_customer_id = ?`,
        [sub.status, sub.customer]
      );
      console.log(`🔄 Subscription ${event.type}: ${sub.customer} -> ${sub.status}`);
    } catch (err) {
      await logWebhookError('SubUpdate', err.message);
    }
  }

  res.status(200).send('✅ Webhook processed');
});

module.exports = router;
