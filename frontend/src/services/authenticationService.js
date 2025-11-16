import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class AuthenticationService {
  // Send verification code
  static async sendVerificationCode(email) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/send-verification`,
        { email }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to send verification code",
      };
    }
  }

  // Register user
  static async register(userData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Registration failed",
      };
    }
  }

  // Login user
  static async login(credentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Login failed",
      };
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/profile/${userId}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch profile",
      };
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch users",
      };
    }
  }

  // Update user profile
  static async updateUserProfile(userId, profileData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/profile/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Profile update failed",
      };
    }
  }
}
