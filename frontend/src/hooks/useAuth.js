// hooks/useAuth.js
import { useState } from "react";
import { AuthenticationService } from "../services/authenticationService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Send verification code
  const sendVerificationCode = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.sendVerificationCode(email);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMsg = "Error sending verification code";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.register(userData);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMsg = "Error registering user";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.login(credentials);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMsg = "Error logging in";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getUserProfile = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.getUserProfile(userId);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMsg = "Error fetching profile";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get all users
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.getAllUsers();
      return result;
    } catch (err) {
      const errorMsg = "Error fetching users";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userId, profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthenticationService.updateUserProfile(
        userId,
        profileData
      );
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMsg = "Error updating profile";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    sendVerificationCode,
    register,
    login,
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    clearError,
  };
};
