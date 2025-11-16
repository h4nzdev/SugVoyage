// controllers/tripPlanController.js
import TripPlan from "../model/tripplanModel.js";

export const tripPlanController = {
  // 🎯 CREATE - Save a new trip plan
  async createTripPlan(req, res) {
    try {
      const tripData = req.body;

      console.log("💾 Saving trip plan:", tripData.title);

      const newTrip = new TripPlan(tripData);
      const savedTrip = await newTrip.save();

      console.log("✅ Trip plan saved:", savedTrip._id);

      res.status(201).json({
        success: true,
        message: "Trip plan created successfully",
        trip: savedTrip,
      });
    } catch (error) {
      console.error("❌ Error creating trip plan:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create trip plan",
        error: error.message,
      });
    }
  },

  // 🎯 READ - Get all trips for a user
  async getUserTrips(req, res) {
    try {
      const { userId } = req.params;

      console.log("📂 Getting trips for user:", userId);

      const trips = await TripPlan.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("title duration budget travelDates status progress coverImage");

      console.log("✅ Found", trips.length, "trips");

      res.json({
        success: true,
        trips: trips,
      });
    } catch (error) {
      console.error("❌ Error getting user trips:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get trips",
        error: error.message,
      });
    }
  },

  // 🎯 READ - Get single trip by ID
  async getTripById(req, res) {
    try {
      const { tripId } = req.params;

      console.log("📖 Getting trip:", tripId);

      const trip = await TripPlan.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip plan not found",
        });
      }

      console.log("✅ Trip found:", trip.title);

      res.json({
        success: true,
        trip: trip,
      });
    } catch (error) {
      console.error("❌ Error getting trip:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get trip",
        error: error.message,
      });
    }
  },

  // 🎯 UPDATE - Update trip plan
  async updateTripPlan(req, res) {
    try {
      const { tripId } = req.params;
      const updates = req.body;

      console.log("✏️ Updating trip:", tripId);

      const updatedTrip = await TripPlan.findByIdAndUpdate(tripId, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedTrip) {
        return res.status(404).json({
          success: false,
          message: "Trip plan not found",
        });
      }

      console.log("✅ Trip updated:", updatedTrip.title);

      res.json({
        success: true,
        message: "Trip plan updated successfully",
        trip: updatedTrip,
      });
    } catch (error) {
      console.error("❌ Error updating trip:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update trip plan",
        error: error.message,
      });
    }
  },

  // 🎯 UPDATE - Mark activity as completed
  async markActivityCompleted(req, res) {
    try {
      const { tripId, dayIndex, activityIndex } = req.params;

      console.log("✅ Marking activity completed for:", {
        tripId,
        dayIndex,
        activityIndex,
      });

      // Convert to numbers
      const dayIdx = parseInt(dayIndex);
      const activityIdx = parseInt(activityIndex);

      const trip = await TripPlan.findById(tripId);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip plan not found",
        });
      }

      console.log("📋 Current trip days:", trip.days.length);
      console.log(
        "📋 Activities in day:",
        trip.days[dayIdx]?.activities?.length
      );

      // Check if indices are valid
      if (!trip.days[dayIdx] || !trip.days[dayIdx].activities[activityIdx]) {
        return res.status(400).json({
          success: false,
          message: "Invalid day or activity index",
        });
      }

      // Mark activity as completed
      trip.days[dayIdx].activities[activityIdx].isCompleted = true;

      console.log(
        "🔄 Before save - Activity completed:",
        trip.days[dayIdx].activities[activityIdx].isCompleted
      );

      // Force progress recalculation
      const totalActivities = trip.days.reduce(
        (total, day) => total + day.activities.length,
        0
      );
      const completedActivities = trip.days.reduce(
        (total, day) =>
          total + day.activities.filter((act) => act.isCompleted).length,
        0
      );

      trip.progress = {
        plannedActivities: totalActivities,
        completedActivities: completedActivities,
        completionPercentage: Math.round(
          (completedActivities / totalActivities) * 100
        ),
      };

      console.log("📊 Progress recalculated:", trip.progress);

      const updatedTrip = await trip.save();

      console.log(
        "💾 After save - Activity completed:",
        updatedTrip.days[dayIdx].activities[activityIdx].isCompleted
      );
      console.log("💾 After save - Progress:", updatedTrip.progress);

      res.json({
        success: true,
        message: "Activity marked as completed",
        trip: updatedTrip,
      });
    } catch (error) {
      console.error("❌ Error marking activity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update activity",
        error: error.message,
      });
    }
  },

  // 🎯 DELETE - Delete trip plan
  async deleteTripPlan(req, res) {
    try {
      const { tripId } = req.params;

      console.log("🗑️ Deleting trip:", tripId);

      const deletedTrip = await TripPlan.findByIdAndDelete(tripId);

      if (!deletedTrip) {
        return res.status(404).json({
          success: false,
          message: "Trip plan not found",
        });
      }

      console.log("✅ Trip deleted:", deletedTrip.title);

      res.json({
        success: true,
        message: "Trip plan deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting trip:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete trip plan",
        error: error.message,
      });
    }
  },
};
