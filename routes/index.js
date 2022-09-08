const express = require('express');
const router = express.Router();
const {ensureAuth, ensureAuth} = require('../middleware/auth');

// @desc Login/Landing Page
// @route GET/
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login',
    });
    // res.send('Login first');
});
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

module.exports = router;