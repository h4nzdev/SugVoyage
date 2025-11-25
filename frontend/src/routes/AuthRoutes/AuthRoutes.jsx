import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../../pages/Auth/Login/Login";
import Register from "../../pages/Auth/Register/Register";
import LandingPage from "../../pages/Landing/LandingPage";
import EmailVerification from "../../pages/Auth/EmailVerification/EmailVerification";
import Welcome from "../../pages/Welcome_Page/Welcome";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<EmailVerification />} />
    </Routes>
  );
};

export default AuthRoutes;
