import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    categoryName: { type: String, required: true },
    categoryIcon: { type: String },
    categoryColor: { type: String },

    description: { type: String, required: true },

    // For now store image URLs/URIs as strings (later you can upload to S3/Cloudinary)
    images: [{ type: String }],

    // Address Snapshot
    address: {
      fullAddress: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    // Scheduling
    preferredDate: { type: Date },     // e.g. selectedDate
    preferredTime: { type: String },   // e.g. "02:30 PM"
    timeSlot: { type: String },        // e.g. "Tomorrow Morning"

    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
