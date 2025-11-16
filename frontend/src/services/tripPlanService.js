// services/tripPlanService.js
import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class TripPlanService {
  // 🎯 Save AI-generated trip plan
  static async saveTripPlan(tripData) {
    try {
      console.log("💾 Saving trip plan to database...");

      const response = await axios.post(`${API_BASE_URL}/trip-plans`, tripData);

      console.log("✅ Trip plan saved!");
      return response.data;
    } catch (error) {
      console.error("❌ Error saving trip plan:", error.message);
      return {
        success: false,
        message: "Failed to save trip plan",
        error: error.message,
      };
    }
  }

  // 🎯 Get user's trips
  static async getUserTrips(userId) {
    try {
      console.log("📂 Getting user trips...");

      const response = await axios.get(
        `${API_BASE_URL}/trip-plans/user/${userId}`
      );

      console.log("✅ User trips loaded!");
      return response.data;
    } catch (error) {
      console.error("❌ Error getting trips:", error.message);
      return {
        success: false,
        message: "Failed to load trips",
        error: error.message,
      };
    }
  }

  static async getTripById(tripId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/trip-plans/${tripId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to load the trip",
        error: error.message,
      };
    }
  }

  // 🎯 Mark activity as completed
  static async markActivityCompleted(tripId, dayIndex, activityIndex) {
    try {
      console.log("✅ Marking activity completed...");

      const response = await axios.patch(
        `${API_BASE_URL}/trip-plans/${tripId}/days/${dayIndex}/activities/${activityIndex}/complete`
      );

      console.log("✅ Activity marked completed!");
      return response.data;
    } catch (error) {
      console.error("❌ Error marking activity:", error.message);
      return {
        success: false,
        message: "Failed to update activity",
        error: error.message,
      };
    }
  }

  static async updateTrip(tripId, updates) {
    try {
      console.log("🔄 Updating trip...");

      const response = await axios.put(
        `${API_BASE_URL}/trip-plans/${tripId}`,
        updates
      );

      console.log("✅ Trip updated!");
      return response.data;
    } catch (error) {
      console.error("❌ Error updating trip:", error.message);
      return {
        success: false,
        message: "Failed to update trip",
        error: error.message,
      };
    }
  }
}
