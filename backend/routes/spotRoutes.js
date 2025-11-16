import express from "express";
import {
  getSpots,
  addSpots,
  getSpotsById,
  getSpotsByCategory,
  getFeaturedSpots,
} from "../controller/spotController.js";

const spotRouter = express.Router();

// Get all spots (with optional category and featured filters via query params)
spotRouter.get("/", getSpots);

// Get featured spots
spotRouter.get("/featured", getFeaturedSpots);

// Get spots by category
spotRouter.get("/category/:category", getSpotsByCategory);

// Get spot by ID
spotRouter.get("/:id", getSpotsById);

// Create new spot
spotRouter.post("/", addSpots);

export default spotRouter;
