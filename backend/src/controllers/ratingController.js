const pool = require('../config/database');
const { validateRating } = require('../utils/validation');

const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Validation
    if (!validateRating(rating)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const storeResult = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    let result;
    let message;

    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING *',
        [rating, user_id, store_id]
      );
      message = 'Rating updated successfully';
    } else {
      // Create new rating
      result = await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [user_id, store_id, rating]
      );
      message = 'Rating submitted successfully';
    }

    res.status(200).json({
      message,
      rating: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT r.*, s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.updated_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = 'SELECT COUNT(*) FROM ratings WHERE user_id = $1';

    const [ratingsResult, countResult] = await Promise.all([
      pool.query(query, [user_id, limit, offset]),
      pool.query(countQuery, [user_id])
    ]);

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      ratings: ratingsResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { store_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Verify store exists and user has access
    const storeResult = await pool.query('SELECT * FROM stores WHERE id = $1', [store_id]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user is store owner or admin
    const store = storeResult.rows[0];
    if (req.user.role === 'store_owner' && store.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = 'SELECT COUNT(*) FROM ratings WHERE store_id = $1';
    const avgQuery = 'SELECT ROUND(AVG(rating)::numeric, 2) as average_rating FROM ratings WHERE store_id = $1';

    const [ratingsResult, countResult, avgResult] = await Promise.all([
      pool.query(query, [store_id, limit, offset]),
      pool.query(countQuery, [store_id]),
      pool.query(avgQuery, [store_id])
    ]);

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      ratings: ratingsResult.rows,
      averageRating: avgResult.rows[0].average_rating || 0,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if rating exists and belongs to user (unless admin)
    let query = 'SELECT * FROM ratings WHERE id = $1';
    let params = [id];

    if (req.user.role !== 'system_admin') {
      query += ' AND user_id = $2';
      params.push(user_id);
    }

    const ratingResult = await pool.query(query, params);
    
    if (ratingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or access denied' });
    }

    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitRating,
  getUserRatings,
  getStoreRatings,
  deleteRating
};