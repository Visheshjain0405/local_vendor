import express from "express";
import {
  sendWhatsAppOTP,
  verifyWhatsAppOTP
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendWhatsAppOTP);
router.post("/verify-otp", verifyWhatsAppOTP);

export default router;
