import { io } from "socket.io-client";
import Config from "../config/api";

const SOCKET_URL = Config.API_BASE_URL;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Emit user location to server
   * Server will track and notify when spots enter radius
   */
  sendUserLocation(userLocation, radius) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("user-location", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: radius,
      });
    }
  }

  /**
   * Listen for spot-in-radius events from server
   */
  onSpotInRadius(callback) {
    if (this.socket) {
      this.socket.on("spot-in-radius", callback);
    }
  }

  /**
   * Remove listener
   */
  offSpotInRadius() {
    if (this.socket) {
      this.socket.off("spot-in-radius");
    }
  }

  /**
   * Get socket instance
   */
  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
export default new SocketService();
