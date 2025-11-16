// routes/tripPlanRoutes.js
import express from "express";
import { tripPlanController } from "../controller/tripPlanController.js";
const tripPlanRouter = express.Router();

// 🎯 Basic CRUD routes
tripPlanRouter.post("/", tripPlanController.createTripPlan);
tripPlanRouter.get("/user/:userId", tripPlanController.getUserTrips);
tripPlanRouter.get("/:tripId", tripPlanController.getTripById);
tripPlanRouter.put("/:tripId", tripPlanController.updateTripPlan);
tripPlanRouter.delete("/:tripId", tripPlanController.deleteTripPlan);

// 🎯 Activity completion
tripPlanRouter.patch(
  "/:tripId/days/:dayIndex/activities/:activityIndex/complete",
  tripPlanController.markActivityCompleted
);

export default tripPlanRouter;
