import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createServiceRequest, getMyRequests } from "../controllers/serviceRequestController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// ✅ "images" must match FormData key in frontend
router.post("/", protect, upload.array("images", 6), createServiceRequest);

router.get("/my", protect, getMyRequests);

export default router;
