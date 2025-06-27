const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔄 Log a new skill, tied to a user
router.post('/log', (req, res) => {
  const { patientName, age, gender, skill, notes, user_id } = req.body;

  const sql = 'INSERT INTO skills (patientName, age, gender, skill, notes, user_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [patientName, age, gender, skill, notes, user_id], (err, result) => {
    if (err) {
      console.error('❌ Skill insert error:', err);
      return res.status(500).send('Failed to log skill');
    }
    res.status(201).send('✅ Skill logged!');
  });
});

// 📥 Fetch all skills for a specific user
router.get('/all/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = 'SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch user skills:', err);
      return res.status(500).send('Failed to retrieve skills');
    }
    res.json(results);
  });
});

// 🧾 Optional: Fetch all for admin/reporting (not user restricted)
router.get('/admin/all', (req, res) => {
  const sql = 'SELECT * FROM skills ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Admin skill fetch failed:', err);
      return res.status(500).send('Failed to retrieve all skills');
    }
    res.json(results);
  });
});

module.exports = router;
