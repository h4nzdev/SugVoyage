import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ai from "../../assets/ai-icon.png";

export default function AIIcon() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the AI icon if we're on the AI chatbot page
  const isOnAIChatbotPage = location.pathname.includes("/main/ai-chatbot");
  const isOnDetailsPage = location.pathname.includes("/main/detailed-info");
  const isOnTravelHubPage = location.pathname.includes("/main/travel-hub");

  if (isOnAIChatbotPage || isOnDetailsPage || isOnTravelHubPage) {
    return null;
  }

  return (
    <div className="fixed right-5 z-[9999] bottom-navbar-aware">
      <button
        onClick={() => navigate("/main/ai-chatbot")}
        className="w-16 h-16 border-2 border-red-300 rounded-full flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 hover:scale-105"
      >
        <img src={ai} alt="AI Assistant" className="w-16 h-16 object-contain" />
      </button>
    </div>
  );
}
