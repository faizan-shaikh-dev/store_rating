import express from "express";
import {
  getProfile,
  updatePassword,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get Logged In User Profile
router.get(
  "/profile",
  isAuthenticated,
  getProfile
);

// Update Password
router.put(
  "/update-password",
  isAuthenticated,
  updatePassword
);

export default router;