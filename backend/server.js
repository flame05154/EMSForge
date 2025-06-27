require('dotenv').config();
console.log('✅ .env variables loaded');

// Confirm essential env variables
console.log('🔐 STRIPE_SECRET_KEY loaded:', !!process.env.STRIPE_SECRET_KEY);
console.log('🔐 STRIPE_WEBHOOK_SECRET loaded:', !!process.env.STRIPE_WEBHOOK_SECRET);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const pricingRoutes = require('./routes/pricing');
const checkoutRoutes = require('./routes/checkoutRoutes');
const webhookRoute = require('./routes/webhook');

const app = express();

// Middleware
console.log('⚙️ Registering middleware...');
app.use(cors());
app.use(bodyParser.json());
console.log('✅ Middleware ready');

// Test DB connection immediately
db.promise().query('SELECT 1')
  .then(() => console.log('✅ Connected to MySQL successfully'))
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

// Routes
console.log('📦 Mounting API routes...');
app.use('/api/auth', (req, res, next) => {
  console.log(`➡️  /api/auth ${req.method}`);
  next();
}, authRoutes);

app.use('/api/skills', (req, res, next) => {
  console.log(`➡️  /api/skills ${req.method}`);
  next();
}, skillRoutes);

app.use('/api/pricing', (req, res, next) => {
  console.log(`➡️  /api/pricing ${req.method}`);
  next();
}, pricingRoutes);

app.use('/api/checkout', (req, res, next) => {
  console.log(`➡️  /api/checkout ${req.method}`);
  next();
}, checkoutRoutes);

app.use('/api/webhook', (req, res, next) => {
  console.log(`➡️  /api/webhook ${req.method}`);
  next();
}, webhookRoute);

// Health check
app.get('/', (req, res) => {
  console.log('🩺 GET / (health check)');
  res.send('EMSForge API is running...');
});

// Handle 404s
app.use((req, res) => {
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found' });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
