const express = require('express');
const { 
  submitRating, 
  getUserRatings, 
  getStoreRatings, 
  deleteRating 
} = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Normal user routes
router.post('/', authenticateToken, authorizeRoles('normal_user'), submitRating);
router.get('/user', authenticateToken, authorizeRoles('normal_user'), getUserRatings);

// Store owner and admin routes
router.get('/store/:store_id', authenticateToken, authorizeRoles('store_owner', 'system_admin'), getStoreRatings);

// Admin routes
router.delete('/:id', authenticateToken, authorizeRoles('normal_user', 'system_admin'), deleteRating);

module.exports = router;