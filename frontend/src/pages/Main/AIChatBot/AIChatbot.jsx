import React, { useState } from "react";
import AIChatbotMobile from "../../Mobile/AIChatbotMobile";
import AIChatbotDesktop from "../../Desktop/AIChatbotDesktop";
import { TripPlanService } from "../../../services/tripPlanService";

// Mock data - replace with your actual API calls
const mockMessages = [
  {
    id: 1,
    text: "🤖 Hi! I'm your AI Travel Planner. I can create personalized Cebu itineraries with optimized routes and travel times. What kind of trip are you planning?",
    sender: "ai",
    timestamp: new Date(),
  },
];

const quickActions = [
  {
    id: "weekend",
    icon: "calendar",
    title: "Weekend Trip",
    subtitle: "2-3 days",
    prompt: "Plan a weekend trip in Cebu for 2-3 days",
  },
  {
    id: "cultural",
    icon: "book",
    title: "Cultural Tour",
    subtitle: "Heritage & History",
    prompt: "Create a cultural heritage itinerary in Cebu",
  },
  {
    id: "adventure",
    icon: "compass",
    title: "Adventure",
    subtitle: "Thrilling activities",
    prompt: "Adventure activities itinerary in Cebu",
  },
  {
    id: "beach",
    icon: "sun",
    title: "Beach Holiday",
    subtitle: "Relaxation focus",
    prompt: "Beach and relaxation itinerary in Cebu",
  },
];

const tripTemplates = [
  "3-day cultural experience in Cebu",
  "Weekend beach getaway in Cebu",
  "5-day adventure tour in Cebu",
  "Family friendly plan in Cebu",
  "Budget travel plan in Cebu",
  "Luxury experience in Cebu",
];

export default function AIChatbot() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);

  const handleSend = async (text = inputText) => {
    if (text.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Simulate API call
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: `I've created your ${text.toLowerCase()}! Here's a sample itinerary:\n\n• Day 1: Explore Cebu City landmarks\n• Day 2: Adventure activities\n• Day 3: Beach relaxation\n\nWould you like me to add more details?`,
          sender: "ai",
          timestamp: new Date(),
          tripData: {
            title: `${text} Itinerary`,
            duration: { days: 3 },
            budget: { total: "₱8,000" },
            days: [
              { activities: ["City Tour", "Local Cuisine"] },
              { activities: ["Adventure Sports", "Waterfalls"] },
              { activities: ["Beach Day", "Sunset Views"] },
            ],
          },
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error("AI Error:", error);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSend(action.prompt);
  };

  const handleTemplateSelect = (template) => {
    handleSend(`Plan a ${template}`);
  };

  const handleSaveTrip = async (tripData) => {
    setSavingTrip(true);

    try {
      console.log("💾 Saving trip to database...", tripData);

      // Add user ID and other required fields
      const tripToSave = {
        ...tripData,
        user: user._id,
        generatedByAI: true,
        status: "planned",
        travelers: {
          adults: 1,
          children: 0,
        },
      };

      const result = await TripPlanService.saveTripPlan(tripToSave);

      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tripData ? { ...msg, showSaveButton: false } : msg
          )
        );
      } else {
        console.log("❌ Error", result.message || "Failed to save trip");
      }
    } catch (error) {
      console.error("❌ Save trip error:", error);
    } finally {
      setSavingTrip(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([mockMessages[0]]);
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <AIChatbotMobile
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          isTyping={isTyping}
          savingTrip={savingTrip}
          onSend={handleSend}
          onQuickAction={handleQuickAction}
          onTemplateSelect={handleTemplateSelect}
          onSaveTrip={handleSaveTrip}
          onClearHistory={clearChatHistory}
          quickActions={quickActions}
          tripTemplates={tripTemplates}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <AIChatbotDesktop
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          isTyping={isTyping}
          savingTrip={savingTrip}
          onSend={handleSend}
          onQuickAction={handleQuickAction}
          onTemplateSelect={handleTemplateSelect}
          onSaveTrip={handleSaveTrip}
          onClearHistory={clearChatHistory}
          quickActions={quickActions}
          tripTemplates={tripTemplates}
        />
      </div>
    </>
  );
}
