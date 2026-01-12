import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH FULL USER FROM DB
    const user = await User.findById(decoded.id).select("-otp -otpExpiry");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 ATTACH FULL USER
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
