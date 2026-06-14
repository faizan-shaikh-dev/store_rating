import db from "../config/db.js";
import bcrypt from "bcryptjs";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateAddress,
} from "../utils/validation.js";

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [stores] = await db.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [ratings] = await db.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: users[0].totalUsers,
        totalStores: stores[0].totalStores,
        totalRatings: ratings[0].totalRatings,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Add User
export const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      role,
    } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password, address, role) are required",
      });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format",
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    const [existingUser] = await db.query(

      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.query(
      `INSERT INTO users
      (name,email,password,address,role)
      VALUES (?,?,?,?,?)`,
      [
        name,
        email,
        hashedPassword,
        address,
        role,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Users
export const getUsers = async (req, res) => {
  try {
    const { search, role, sortBy, order } = req.query;

    let query = `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
    `;
    let conditions = [];
    let params = [];

    if (role) {
      conditions.push("role = ?");
      params.push(role);
    }

    if (search) {
      conditions.push("(name LIKE ? OR email LIKE ? OR address LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    // Sorting
    const allowedSortFields = ["name", "email", "address", "role"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const [users] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get User By Id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `SELECT
       id,
       name,
       email,
       address,
       role
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const user = users[0];

    if (user.role === "owner") {
      const [stores] = await db.query(
        `SELECT 
          s.id, 
          s.name, 
          s.email, 
          s.address, 
          COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [id]
      );
      if (stores.length > 0) {
        user.store = stores[0];
        user.average_rating = stores[0].average_rating;
      } else {
        user.average_rating = 0;
        user.store = null;
      }
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Add Store
export const addStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      owner_id,
    } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [owner] = await db.query(
      "SELECT * FROM users WHERE id = ? AND role = 'owner'",
      [owner_id]
    );

    if (owner.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Owner not found or user is not a Store Owner",
      });
    }

    // Verify if owner already has a store
    const [existingStore] = await db.query(
      "SELECT * FROM stores WHERE owner_id = ?",
      [owner_id]
    );

    if (existingStore.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This owner already owns a store. An owner can only manage one store.",
      });
    }

    await db.query(
      `INSERT INTO stores
      (name,email,address,owner_id)
      VALUES (?,?,?,?)`,
      [
        name,
        email,
        address,
        owner_id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Store Created Successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Stores
export const getStores = async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        u.name AS owner_name,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    let conditions = [];
    let params = [];

    if (search) {
      conditions.push("(s.name LIKE ? OR s.address LIKE ? OR s.email LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` GROUP BY s.id, u.id`;

    // Sorting
    const allowedSortFields = ["name", "email", "address", "average_rating", "owner_name"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "s.id";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const [stores] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      stores,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};