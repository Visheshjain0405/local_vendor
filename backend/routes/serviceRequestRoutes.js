import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createServiceRequest, getMyRequests } from "../controllers/serviceRequestController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    // Allow images and documents (pdf, doc, docx, txt)
    // You can add specific checks if needed, but for now we essentially allow all or check basic types
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "text/plain"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload images or documents."));
    }
  },
});

// ✅ "images" must match FormData key in frontend
router.post("/", protect, upload.array("images", 6), createServiceRequest);

router.get("/my", protect, getMyRequests);

export default router;
