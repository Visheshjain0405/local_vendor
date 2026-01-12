import Location from "../models/Location.js";

/**
 * SAVE LOCATION
 */
export const saveLocation = async (req, res) => {
  try {
    const { address, coordinates, addressType } = req.body;
console.log("Saving location for user:", req.user.id);
console.log("Address:", address);
console.log("Coordinates:", coordinates);
console.log("Location Type:",addressType)
    if (!address || !coordinates) {
      return res.status(400).json({ message: "Location data required" });
    }

    const location = await Location.create({
      user: req.user.id,
      address,
      coordinates,
      addressType:addressType || "home",
    });

    res.status(201).json({
      success: true,
      message: "Location saved successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER LOCATIONS
 */
export const getUserLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
