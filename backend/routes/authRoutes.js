const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// REGISTER
router.post('/register', limiter, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for existing user
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('❌ Error checking user:', err);
        return res.status(500).send('Database error');
      }

      if (existingUser.length > 0) {
        return res.status(409).send('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('❌ Registration DB error:', err);
            return res.status(500).send('Registration failed');
          }

          const newUser = {
            id: result.insertId,
            name,
            email
          };

          const token = jwt.sign({ id: newUser.id }, 'secretKey', { expiresIn: '1h' });

          console.log('✅ New user registered:', email);
          res.status(201).json({ token, user: newUser });
        }
      );
    });
  } catch (err) {
    console.error('❌ Hashing error:', err);
    res.status(500).send('Server error');
  }
});

// LOGIN
router.post('/login', limiter, (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 Attempt login for: ${email}`);

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      console.log('❌ No user found with this email.');
      return res.status(401).send('Invalid credentials');
    }

    const user = results[0];
    console.log('✅ User found:', user);

    try {
      const match = await bcrypt.compare(password, user.password);
      console.log('🔍 Password match result:', match);

      if (!match) {
        return res.status(401).send('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      res.json({ token, user: userData });
    } catch (err) {
      console.error('❌ bcrypt error:', err);
      res.status(500).send('Server error');
    }
  });
});

module.exports = router;
