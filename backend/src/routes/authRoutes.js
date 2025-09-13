const express = require('express');
const { register, login, updatePassword } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/update-password', authenticateToken, updatePassword);

module.exports = router;