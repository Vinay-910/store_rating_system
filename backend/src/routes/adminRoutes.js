const express = require('express');
const { 
  getDashboardStats, 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/adminController');
const { createStore, getAllStores } = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All admin routes require system_admin role
router.use(authenticateToken, authorizeRoles('system_admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Store management (admin view)
router.get('/stores', getAllStores);
router.post('/stores', createStore);

module.exports = router;