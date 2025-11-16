import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class ChatService {
  static async sendMessage(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message to AI:", error.message);
      return {
        success: false,
        message: "Failed to get AI response",
        error: error.message,
      };
    }
  }
}
