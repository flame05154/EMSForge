const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const db = require('../config/db');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/checkout/create-session
router.post('/create-session', async (req, res) => {
  console.log('➡️  [POST] /api/checkout/create-session called');
  console.log('📦 Request Body:', req.body);

  const { firstName, lastName, email, productId } = req.body;

  if (!firstName || !lastName || !email || !productId) {
    console.warn('⚠️  Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`🔍 Checking if email exists: ${email}`);
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.warn('❌ Email already exists');
      return res.status(409).json({ error: 'Email already registered. Please login.' });
    }

    console.log('🧾 Creating Stripe Checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: productId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://emsforge.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://emsforge.com/register',
      metadata: {
        firstName,
        lastName,
        email,
        productId,
        createdBy: 'Register.jsx',
      },
    });

    console.log('✅ Stripe session created:', session.id);

    console.log('💾 Inserting session into stripe_sessions table...');
    await db.promise().query(`
      INSERT INTO stripe_sessions 
      (session_id, email, product_id, first_name, last_name, status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [session.id, email, productId, firstName, lastName, 'created']
    );
    console.log('✅ Session saved to database');

    res.json({ url: session.url });

  } catch (err) {
    console.error('❌ Stripe session creation or DB insert failed:', err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

// GET /api/checkout/session/:sessionId
router.get('/session/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  console.log(`➡️  [GET] /api/checkout/session/${sessionId}`);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customer = await stripe.customers.retrieve(session.customer);
    const email = customer.email;

    console.log(`📩 Retrieved email from Stripe: ${email}`);

    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      console.warn('⚠️  No user found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    const token = `token-${user.id}-${Date.now()}`; // Replace with real JWT in production

    console.log(`✅ Session lookup success for user ${user.id}`);

    return res.json({
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('❌ Error retrieving session info:', err);
    return res.status(500).json({ error: 'Unable to fetch session details' });
  }
});

module.exports = router;
