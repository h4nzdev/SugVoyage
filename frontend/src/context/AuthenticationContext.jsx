import { createContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("sugvoyage_user") ||
        sessionStorage.getItem("sugvoyage_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from storage", error);
      localStorage.removeItem("sugvoyage_user");
      sessionStorage.removeItem("sugvoyage_user");
      return null;
    }
  });

  // Use the auth hook - this gives you loading, error, and the actual functions
  const {
    loading,
    error,
    login: authLogin,
    register: authRegister,
    clearError: authClearError,
  } = useAuth();

  // Enhanced login function that integrates with your service
  const login = useCallback(
    async (credentials, rememberMe = false) => {
      // Call the actual authentication service
      const result = await authLogin(credentials);

      if (result.success && result.user) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("sugvoyage_user", JSON.stringify(result.user));
        setUser(result.user);
        return { success: true };
      }
      // Error is already set by the hook, so we don't need to set it here
      return { success: false, message: result.message };
    },
    [authLogin]
  );

  // Enhanced register function that integrates with your service
  const register = useCallback(
    async (userData, rememberMe = false) => {
      // Call the actual authentication service
      const result = await authRegister(userData);

      if (result.success && result.user) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("sugvoyage_user", JSON.stringify(result.user));
        setUser(result.user);
        return { success: true };
      }
      // Error is already set by the hook
      return { success: false, message: result.message };
    },
    [authRegister]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("sugvoyage_user");
    sessionStorage.removeItem("sugvoyage_user");
    setUser(null);
    authClearError();
  }, [authClearError]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: authClearError,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
