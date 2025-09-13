const express = require('express');
const { 
  getAllStores, 
  getStoreById, 
  createStore, 
  updateStore, 
  deleteStore 
} = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Public route (for normal users to view stores)
router.get('/', authenticateToken, getAllStores);
router.get('/:id', authenticateToken, getStoreById);

// Admin only routes
router.post('/', authenticateToken, authorizeRoles('system_admin'), createStore);
router.put('/:id', authenticateToken, authorizeRoles('system_admin'), updateStore);
router.delete('/:id', authenticateToken, authorizeRoles('system_admin'), deleteStore);

module.exports = router;