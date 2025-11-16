// controller/SpotsController.js
import Spots from "../model/spotModel.js";

// Get all spots with optional filtering
export const getSpots = async (req, res) => {
  try {
    const { category, featured } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" }; // Case-insensitive
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const spots = await Spots.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spots.length,
      data: spots,
    });
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spots",
      error: error.message,
    });
  }
};

// Get spot by ID
export const getSpotsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Spot ID is required",
      });
    }

    const spot = await Spots.findById(id);

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: "Spot not found",
      });
    }

    res.status(200).json({
      success: true,
      data: spot,
    });
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spot",
      error: error.message,
    });
  }
};

// Add new spot with validation
export const addSpots = async (req, res) => {
  try {
    const { name, location, latitude, longitude, type, category, description } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !location ||
      latitude === undefined ||
      longitude === undefined ||
      !type ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, location, latitude, longitude, type, category",
      });
    }

    // Validate numeric values
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be numbers",
      });
    }

    const newSpot = new Spots(req.body);
    const savedSpot = await newSpot.save();

    res.status(201).json({
      success: true,
      message: "Spot created successfully",
      data: savedSpot,
    });
  } catch (error) {
    console.error("Error creating spot:", error);
    res.status(400).json({
      success: false,
      message: "Error creating spot",
      error: error.message,
    });
  }
};

// Get spots by category
export const getSpotsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const spots = await Spots.find({
      category: { $regex: category, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spots.length,
      data: spots,
    });
  } catch (error) {
    console.error("Error fetching spots by category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spots by category",
      error: error.message,
    });
  }
};

// Get featured spots
export const getFeaturedSpots = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const spots = await Spots.find({ featured: true })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spots.length,
      data: spots,
    });
  } catch (error) {
    console.error("Error fetching featured spots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured spots",
      error: error.message,
    });
  }
};
