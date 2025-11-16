// server.js
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import spotRouter from "./routes/spotRoutes.js";
import authRouter from "./routes/authentication_routes/authRoutes.js";
import postRouter from "./routes/post_routes/postRoutes.js";
import chatRouter from "./routes/ai_routes/chatRoutes.js";
import tripPlanRouter from "./routes/tripPlanRoutes.js";
import commentRouter from "./routes/post_routes/commentRoutes.js";
import { CebuSpotsService } from "./services/spotsService.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/spots", spotRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/ai", chatRouter);
app.use("/api/comments", commentRouter);
app.use("/api/trip-plans", tripPlanRouter);

// Store user locations for real-time tracking
const userLocations = new Map();

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Handle user location updates
  socket.on("user-location", async (data) => {
    const { latitude, longitude, radius } = data;

    // Store user location
    userLocations.set(socket.id, {
      latitude,
      longitude,
      radius,
      lastChecked: Date.now(),
    });

    console.log(`📍 User location updated: ${socket.id}`);

    // Fetch all spots
    try {
      const allSpots = await CebuSpotsService.getAllCebuSpots();

      if (!allSpots || allSpots.length === 0) return;

      // Check which spots are in radius
      const spotsInRadius = allSpots.filter((spot) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          spot.latitude || spot.lat,
          spot.longitude || spot.lon
        );
        return distance <= radius;
      });

      // Send notification if spots found
      if (spotsInRadius.length > 0) {
        const nearestSpot = spotsInRadius[0];
        socket.emit("spot-in-radius", {
          message: `${spotsInRadius.length} spot(s) found near you!`,
          count: spotsInRadius.length,
          nearestSpot: nearestSpot.name,
          spots: spotsInRadius.slice(0, 5), // Send top 5 spots
        });

        console.log(
          `🔔 Notification sent to ${socket.id}: ${nearestSpot.name}`
        );
      }
    } catch (error) {
      console.error("Error checking spots:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    userLocations.delete(socket.id);
    console.log(`👤 User disconnected: ${socket.id}`);
  });
});

// Utility function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Start server
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} with Socket.io`)
);
