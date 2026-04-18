const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
      .run(username, email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;