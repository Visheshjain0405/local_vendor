import express from "express";
import {
  saveLocation,
  getUserLocations,
} from "../controllers/locationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveLocation);
router.get("/", protect, getUserLocations);

export default router;
