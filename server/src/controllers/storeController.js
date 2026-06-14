import db from "../config/db.js";

// Create Store
export const createStore = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Store name and address are required",
      });
    }

    const [existingStore] = await db.query(
      "SELECT * FROM stores WHERE name = ?",
      [name]
    );

    if (existingStore.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Store already exists",
      });
    }

    const [result] = await db.query(
      "INSERT INTO stores (name, address) VALUES (?, ?)",
      [name, address]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      storeId: result.insertId,
    });
  } catch (error) {
    console.log("Create Store Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Stores
export const getAllStores = async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    const userId = req.user ? req.user.id : null;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    let conditions = [];
    let params = [userId];

    if (search) {
      conditions.push("(s.name LIKE ? OR s.address LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` GROUP BY s.id`;

    // Sorting
    const allowedSortFields = ["name", "address", "average_rating"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "s.id";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const [stores] = await db.query(query, params);

    res.status(200).json({
      success: true,
      totalStores: stores.length,
      stores,
    });
  } catch (error) {
    console.log("Get Stores Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Store
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const [store] = await db.query(
      `
      SELECT
        s.*,
        COALESCE(ROUND(AVG(r.rating),1), 0) AS average_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS user_rating
      FROM stores s
      LEFT JOIN ratings r
      ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
      `,
      [userId, id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Fetch review ratings submitted by other users
    const [ratings] = await db.query(
      `
      SELECT 
        r.id,
        r.rating,
        u.name AS user_name,
        r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      store: store[0],
      ratings,
    });
  } catch (error) {
    console.log("Get Store Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Store
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const [store] = await db.query(
      "SELECT * FROM stores WHERE id = ?",
      [id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await db.query(
      "UPDATE stores SET name = ?, address = ? WHERE id = ?",
      [name, address, id]
    );

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
    });
  } catch (error) {
    console.log("Update Store Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Store
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const [store] = await db.query(
      "SELECT * FROM stores WHERE id = ?",
      [id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await db.query(
      "DELETE FROM stores WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.log("Delete Store Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Store Owner Dashboard Stats & Rating list
export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get store owned by this user
    const [stores] = await db.query(
      "SELECT id, name, email, address FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found for this owner",
      });
    }

    const store = stores[0];

    // Get average rating
    const [avgResult] = await db.query(
      "SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating FROM ratings WHERE store_id = ?",
      [store.id]
    );
    const averageRating = avgResult[0].average_rating;

    // Get list of ratings with user details
    const [ratings] = await db.query(
      `SELECT r.id, r.rating, u.name AS user_name, u.email AS user_email, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    return res.status(200).json({
      success: true,
      store,
      averageRating,
      ratings
    });
  } catch (error) {
    console.error("Owner Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};