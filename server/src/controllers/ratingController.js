import db from "../config/db.js";

// Submit Rating
export const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Store ID and Rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const [store] = await db.query(
      "SELECT * FROM stores WHERE id = ?",
      [store_id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const [existingRating] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, store_id]
    );

    if (existingRating.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this store",
      });
    }

    await db.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [user_id, store_id, rating]
    );

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.log("Submit Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Rating
export const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const [existingRating] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, storeId]
    );

    if (existingRating.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    await db.query(
      "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
      [rating, user_id, storeId]
    );

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.log("Update Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Ratings By Store
export const getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const [ratings] = await db.query(
      `
      SELECT 
        r.id,
        r.rating,
        u.name AS user_name
      FROM ratings r
      JOIN users u
      ON r.user_id = u.id
      WHERE r.store_id = ?
      `,
      [storeId]
    );

    const [avgRating] = await db.query(
      `
      SELECT ROUND(AVG(rating),1) AS average_rating
      FROM ratings
      WHERE store_id = ?
      `,
      [storeId]
    );

    res.status(200).json({
      success: true,
      averageRating: avgRating[0].average_rating || 0,
      totalRatings: ratings.length,
      ratings,
    });
  } catch (error) {
    console.log("Get Ratings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};