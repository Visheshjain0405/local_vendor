import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
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
