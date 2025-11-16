import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import MainRoutes from "./MainRoutes/MainRoutes";
import AuthRoutes from "./AuthRoutes/AuthRoutes";

export default function Role() {
  const { user, loading } = useContext(AuthenticationContext);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) return <MainRoutes />;
  if (!user) return <AuthRoutes />;
  return null;
}
