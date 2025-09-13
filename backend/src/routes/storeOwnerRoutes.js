const express = require('express');
const { getStoreRatings } = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// All store owner routes require store_owner role
router.use(authenticateToken, authorizeRoles('store_owner'));

// Get store owner's store information
router.get('/store', async (req, res) => {
  try {
    const query = `
      SELECT s.*, srv.average_rating, srv.total_ratings
      FROM stores s
      LEFT JOIN store_ratings_view srv ON s.id = srv.id
      WHERE s.owner_id = $1
    `;
    
    const result = await pool.query(query, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    res.json({ store: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ratings for store owner's store
router.get('/store/ratings', async (req, res) => {
  try {
    // Find store owned by this user
    const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    req.params.store_id = storeResult.rows[0].id;
    return getStoreRatings(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;