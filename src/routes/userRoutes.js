const express = require('express');
const { getAllUsers, getUserInfo } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Authenticated routes
router.get('/users', authMiddleware, roleMiddleware, getAllUsers);   // Admin tüm kullanıcıları görebilir
router.get('/me', authMiddleware, getUserInfo);                      // Personel kendi bilgilerini görebilir

module.exports = router;
