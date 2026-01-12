import User from "../models/User.js";
import { generateOTP, getOTPExpiry } from "../utils/otpUtil.js";
import { sendWhatsAppOTPMessage } from "../utils/whatsappUtil.js";
import { generateToken } from "../utils/tokenUtil.js";

/**
 * SEND OTP (DEV MOCK / PROD WHATSAPP)
 */
export const sendWhatsAppOTP = async (req, res) => {
  try {
    const { phone, role } = req.body;

    console.log("Received OTP request for phone:", phone);

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    let user = await User.findOne({ phone });

    const otp = generateOTP();

    if (!user) {
      user = await User.create({
        phone,
        role,
        otp,
        otpExpiry: getOTPExpiry()
      });
    } else {
      user.otp = otp;
      user.otpExpiry = getOTPExpiry();
      await user.save();
    }

    /**
     * ✅ DEV MODE → RETURN OTP
     */
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 DEV OTP:", otp);

      return res.json({
        success: true,
        message: "OTP generated (DEV MODE)",
        otp // ⚠️ only in dev
      });
    }

    /**
     * 🚀 PROD MODE → SEND WHATSAPP OTP (AFTER TEMPLATE APPROVAL)
     */
    await sendWhatsAppOTPMessage(phone, otp);

    res.json({
      success: true,
      message: "OTP sent to WhatsApp"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * VERIFY OTP (SAME FOR DEV & PROD)
 */
export const verifyWhatsAppOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("Verifying OTP for phone:", phone, "OTP:", otp);

    const user = await User.findOne({ phone });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
