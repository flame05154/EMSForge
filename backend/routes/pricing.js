const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Debug check (optional)
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is undefined");
}

router.get('/', async (req, res) => {
  try {
    const products = await stripe.products.list({ active: true });
    const prices = await stripe.prices.list({ active: true, expand: ['data.product'] });

    const pricingData = prices.data.map((price) => ({
      id: price.id,
      product: price.product.name,
      description: price.product.description,
      unit_amount: (price.unit_amount || 0) / 100,
      currency: price.currency.toUpperCase(),
      recurring: price.recurring?.interval || null,
      tiers_mode: price.tiers_mode,
      metadata: price.metadata,
    }));

    res.json(pricingData);
  } catch (error) {
    console.error('❌ Stripe pricing error:', error);
    res.status(500).json({ error: 'Unable to fetch pricing' });
  }
});

module.exports = router;
