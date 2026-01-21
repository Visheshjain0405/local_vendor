import express from "express";
import {
  sendWhatsAppOTP,
  verifyWhatsAppOTP,
  getProfile,
  updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendWhatsAppOTP);
router.post("/verify-otp", verifyWhatsAppOTP);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, (req, res, next) => {
  console.log("📥 [PUT /profile] Headers:", req.headers['content-type']);
  next();
}, upload.single("profileImage"), updateProfile);

export default router;
