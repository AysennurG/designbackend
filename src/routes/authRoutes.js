const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Kullanıcı kayıt ve giriş rotaları
router.post('/register', register); // Kayıt
router.post('/login', login);       // Giriş

module.exports = router;
