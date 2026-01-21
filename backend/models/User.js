import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: "Unknown User"
    },
    profileImage: {
      type: String, // URL or base64 string
      default: ""
    },
    role: {
      type: String,
      enum: ["user", "vendor"],
      default: "user"
    },

    otp: {
      type: String
    },

    otpExpiry: {
      type: Date
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
