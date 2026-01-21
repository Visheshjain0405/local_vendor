import "dotenv/config"; // ✅ loads .env before other imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js"
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/requests", serviceRequestRoutes)

app.get("/", (req, res) => {
  res.send("🚀 Local Service Auth API Running");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`✅ Backend updated`);
});
// Trigger Restart


