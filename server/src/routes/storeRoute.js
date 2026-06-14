import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  getOwnerDashboard,
} from "../controllers/storeController.js";

import {isAuthenticated}from "../middleware/authMiddleware.js"
import {authorizeRoles} from "../middleware/roleMiddleware.js";

const router = express.Router();

// Protected Routes
router.get("/", isAuthenticated, getAllStores);
router.get("/owner/dashboard", isAuthenticated, authorizeRoles("owner"), getOwnerDashboard);
router.get("/:id", isAuthenticated, getStoreById);


// Admin Routes
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  createStore
);

router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateStore
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteStore
);

export default router;