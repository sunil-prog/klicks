// Register
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
    console.log('Register attempt:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Missing fields');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            console.error('DB query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            console.log('Email exists:', email);
            return res.status(400).json({ error: 'Email already exists' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
                if (err) {
                    console.error('DB insert error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                console.log('User registered:', email);
                res.json({ success: true });
            });
        } catch (e) {
            console.error('Hashing error:', e);
            res.status(500).json({ error: 'Server error' });
        }
    });
});



// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });
        req.session.userId = user.id;
        res.json({ success: true });
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// Protected route
router.get('/dashboard', (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ error: 'Not authenticated' });
    res.json({ message: 'Welcome to your dashboard!' });
});

// Existing requires and setup...

router.get('/session', (req, res) => {
    if (req.session && req.session.userId) {
        db.get('SELECT email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
            if (err || !user) {
                return res.status(500).json({ error: 'User fetch error' });
            }
            res.json({ loggedIn: true, email: user.email });
        });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;

