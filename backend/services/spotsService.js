import Spot from "../model/spotModel.js";

export class CebuSpotsService {
  static async getAllCebuSpots() {
    try {
      console.log("🔄 Fetching spots from database...");
      const spots = await Spot.find();
      console.log("✅ Spots fetched successfully!");
      return spots || [];
    } catch (error) {
      console.error("❌ Error fetching spots:", error.message);
      return [];
    }
  }

  static async getSpotById(id) {
    try {
      const spot = await Spot.findById(id);
      return spot || null;
    } catch (error) {
      console.error(`❌ Error fetching spot with ID ${id}:`, error.message);
      return null;
    }
  }
}
