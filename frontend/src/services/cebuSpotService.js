import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class CebuSpotsService {
  static async getAllCebuSpots() {
    try {
      const response = await axios.get(`${API_BASE_URL}/spots`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("❌ Error fetching spots:", error.message);
      return [];
    }
  }

  // Get spot by ID directly from API
  static async getSpotByIdFromAPI(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
      return response.data.data || response.data || null;
    } catch (error) {
      console.error(`Error fetching spot with ID ${id}:`, error.message);
      return null;
    }
  }

  // Safe search with null checks
  static async searchSpots(query = "", limit = 20) {
    try {
      const allSpots = await this.getAllCebuSpots();

      if (!Array.isArray(allSpots)) {
        return [];
      }

      if (!query.trim()) {
        return allSpots.slice(0, limit);
      }

      const searchTerm = query.toLowerCase();
      const filtered = allSpots.filter((spot) => {
        if (!spot) return false;

        const name = spot.name?.toLowerCase() || "";
        const location = spot.location?.toLowerCase() || "";
        const type = spot.type?.toLowerCase() || "";
        const category = spot.category?.toLowerCase() || "";
        const description = spot.description?.toLowerCase() || "";

        return (
          name.includes(searchTerm) ||
          location.includes(searchTerm) ||
          type.includes(searchTerm) ||
          category.includes(searchTerm) ||
          description.includes(searchTerm)
        );
      });

      return filtered.slice(0, limit);
    } catch (error) {
      console.error("❌ Error searching spots:", error);
      return [];
    }
  }

  // Search by category with API endpoint
  static async searchByCategory(category) {
    try {
      if (!category || category === "all") {
        return await this.getAllCebuSpots();
      }
      const response = await axios.get(
        `${API_BASE_URL}/spots/category/${category}`
      );
      return response.data.data || response.data || [];
    } catch (error) {
      console.error(`Error fetching category ${category}:`, error.message);
      // Fallback to client-side filtering
      console.log("🔄 Falling back to client-side filtering...");
      const allSpots = await this.getAllCebuSpots();
      return allSpots.filter(
        (spot) => spot?.category?.toLowerCase() === category?.toLowerCase()
      );
    }
  }

  // Get spot by ID
  static async getSpotById(id) {
    try {
      const allSpots = await this.getAllCebuSpots();
      return (
        allSpots.find((spot) => spot?._id === id || spot?.id === id) || null
      );
    } catch (error) {
      console.error("Error finding spot:", error);
      return null;
    }
  }

  // Get featured spots
  static async getFeaturedSpots(limit = 6) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/spots/featured?limit=${limit}`
      );
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching featured spots:", error.message);
      // Fallback to client-side filtering
      const allSpots = await this.getAllCebuSpots();
      return allSpots.filter((spot) => spot?.featured).slice(0, limit);
    }
  }

  // Get nearby spots based on coordinates
  static async getNearbySpots(lat, lng, radius = 50) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allSpots = await this.getAllCebuSpots();

      if (!Array.isArray(allSpots)) {
        return [];
      }

      return allSpots.filter((spot) => {
        if (!spot) return false;
        const distance = this.calculateDistance(
          lat,
          lng,
          spot.latitude,
          spot.longitude
        );
        return distance <= radius;
      });
    } catch (error) {
      console.error("Error fetching nearby spots:", error);
      return [];
    }
  }

  // Helper function to calculate distance (simplified)
  static calculateDistance(lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) return Infinity;
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
  }
}
