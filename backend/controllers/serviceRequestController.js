import ServiceRequest from "../models/ServiceRequest.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const createServiceRequest = async (req, res) => {
  try {
    const {
      categoryName,
      categoryIcon,
      categoryColor,
      description,
      preferredDate,
      preferredTime,
      timeSlot,
    } = req.body;

    console.log(req.body)

    if (!categoryName || !description) {
      return res.status(400).json({ message: "Category and description are required" });
    }

    // ✅ upload images and keep only urls
    let imageUrls = [];
    if (req.files?.length) {
      const results = await Promise.all(
        req.files.map((f) => uploadBufferToCloudinary(f.buffer, { folder: "service_requests" }))
      );

      imageUrls = results.map((r) => r.secure_url); // ✅ only url
    }

    const request = await ServiceRequest.create({
      user: req.user._id,
      categoryName,
      categoryIcon,
      categoryColor,
      description,
      images: imageUrls, // ✅ only urls saved
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime: preferredTime || null,
      timeSlot: timeSlot || null,
      address: req.body.address ? JSON.parse(req.body.address) : null, // Handle FormData parsing if sent as string
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

