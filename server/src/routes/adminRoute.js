import express from "express";

import {
  getDashboardStats,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores,
} from "../controllers/adminController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";
import {authorizeRoles}  from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin Access Only
router.use(isAuthenticated);
router.use(authorizeRoles("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.post("/users", addUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

// Stores
router.post("/stores", addStore);
router.get("/stores", getStores);

export default router;