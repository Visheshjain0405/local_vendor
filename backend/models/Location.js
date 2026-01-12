import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      city: { type: String, required: true },
      houseNo: { type: String, required: true },
      roadArea: { type: String, required: true },
      landmark: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },

   addressType: {
  type: String,
  enum: ["home", "office", "other"],
  default: "home",
},

    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
