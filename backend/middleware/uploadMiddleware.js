import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "local_service/profiles",
        // allowed_formats: ["jpg", "png", "jpeg"], // Commented out to allow all types for now
        public_id: (req, file) => {
            if (!req.user || !req.user.id) {
                console.error("❌ Missing user in uploadMiddleware!");
                return `unknown_${Date.now()}`;
            }
            return `user_${req.user.id}_profile`;
        },
        overwrite: true,
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        fieldSize: 10 * 1024 * 1024 // 10MB field size limit (for base64 if sent as string, though we are using formData)
    }
});

export default upload;
