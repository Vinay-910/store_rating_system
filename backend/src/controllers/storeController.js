const pool = require('../config/database');
const { validateName, validateEmail, validateAddress } = require('../utils/validation');

const getAllStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Determine the current user ID for rating join (null if not logged in)
    const userId = (req.user && req.user.role === 'normal_user') ? req.user.id : null;

    // Base query
    let query = `
      SELECT s.*, srv.average_rating, srv.total_ratings,
             r.rating as user_rating
      FROM stores s
      LEFT JOIN store_ratings_view srv ON s.id = srv.id
      LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $1
    `;
    let params = [userId];

    // Add search
    if (search) {
      query += ` WHERE (s.name ILIKE $2 OR s.address ILIKE $3)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    const validSortFields = ['name', 'email', 'address', 'average_rating'];
    const validSortOrders = ['ASC', 'DESC'];
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      if (sortBy === 'average_rating') {
        query += ` ORDER BY srv.${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        query += ` ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    }

    // Pagination
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Count query
    let countQuery = 'SELECT COUNT(*) FROM stores s';
    if (search) {
      countQuery += ` WHERE (s.name ILIKE $1 OR s.address ILIKE $2)`;
    }

    // Execute queries
    const [storesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, search ? params.slice(1, 3) : [])
    ]);

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      stores: storesResult.rows,
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

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT s.*, srv.average_rating, srv.total_ratings,
             CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE NULL END as user_rating
      FROM stores s
      LEFT JOIN store_ratings_view srv ON s.id = srv.id
    `;
    
    let params = [id];

    // Add user's rating if authenticated
    if (req.user && req.user.role === 'normal_user') {
      query += ` LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $2`;
      params.push(req.user.id);
    }

    query += ` WHERE s.id = $1`;

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ store: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Validation
    if (!validateName(name)) {
      return res.status(400).json({ error: 'Store name must be between 20-60 characters' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Address cannot exceed 400 characters' });
    }

    // Check if store email already exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    // Verify owner exists and is a store_owner
    if (owner_id) {
      const ownerResult = await pool.query('SELECT id, role FROM users WHERE id = $1', [owner_id]);
      if (ownerResult.rows.length === 0 || ownerResult.rows[0].role !== 'store_owner') {
        return res.status(400).json({ error: 'Invalid store owner' });
      }
    }

    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    // Validation
    if (name && !validateName(name)) {
      return res.status(400).json({ error: 'Store name must be between 20-60 characters' });
    }
    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (address && !validateAddress(address)) {
      return res.status(400).json({ error: 'Address cannot exceed 400 characters' });
    }

    // Check if store exists
    const existingStore = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (address) {
      updates.push(`address = $${paramIndex++}`);
      values.push(address);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE stores SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      message: 'Store updated successfully',
      store: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};