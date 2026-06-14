import express from "express";
import {
  submitRating,
  updateRating,
  getRatingsByStore,
} from "../controllers/ratingController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, submitRating);

router.put("/:storeId", isAuthenticated, updateRating);

router.get("/store/:storeId", getRatingsByStore);

export default router;