// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// authController'ı buradan içe aktar
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.verifyToken, authController.profile);

// Email doğrulama işlemi için yeni route
router.get('/verify-email', authController.verifyEmail); // ← Burayı ekledik

module.exports = router;
