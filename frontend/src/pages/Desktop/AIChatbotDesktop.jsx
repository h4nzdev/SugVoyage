import React, { useState, useRef, useEffect, useContext } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Send,
  Calendar,
  Book,
  Compass,
  Sun,
  Save,
  Bot,
  User,
  Sparkles,
  Eye,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { ChatService } from "../../services/aiService";
import { TripPlanService } from "../../services/tripPlanService";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import TripPreviewModal from "../../components/AIChatbot/TripPreviewModal";

// Quick Actions Component
const QuickActions = ({ onActionPress, isVisible }) => {
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

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 mb-6">
      <div className="text-center mb-4">
        <Sparkles className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Quick Start Templates
        </h2>
        <p className="text-gray-600 text-sm">
          Choose a template to get started instantly
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionPress(action)}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200 text-left group hover:scale-105"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {action.icon === "calendar" && (
                <Calendar className="w-5 h-5 text-red-600" />
              )}
              {action.icon === "book" && (
                <Book className="w-5 h-5 text-red-600" />
              )}
              {action.icon === "compass" && (
                <Compass className="w-5 h-5 text-red-600" />
              )}
              {action.icon === "sun" && (
                <Sun className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="font-semibold text-gray-900 text-sm mb-1">
              {action.title}
            </div>
            <div className="text-gray-500 text-xs">{action.subtitle}</div>
          </button>
        ))}
      </div>

      <TripTemplates onTemplateSelect={onActionPress} />
    </div>
  );
};

// Trip Templates Component
const TripTemplates = ({ onTemplateSelect }) => {
  const tripTemplates = [
    "3-day cultural experience",
    "Weekend beach getaway",
    "5-day adventure tour",
    "Family friendly plan",
    "Budget travel plan",
    "Luxury experience",
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 text-center mb-3">
        Or try these popular styles:
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {tripTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateSelect({ prompt: template + " in Cebu" })}
            className="bg-white/80 hover:bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all duration-200 text-center group"
          >
            <span className="text-gray-700 text-xs font-medium group-hover:text-red-600">
              {template}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Message List Component
const MessageList = ({
  messages,
  isTyping,
  onSaveTrip,
  savingTrip,
  showTemplates,
  onQuickAction,
}) => {
  const messagesEndRef = useRef(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePreviewTrip = (tripData) => {
    setSelectedTripData(tripData);
    setPreviewModalVisible(true);
  };

  const handleSaveTrip = (tripData) => {
    setPreviewModalVisible(false);
    onSaveTrip(tripData);
  };

  const formatAIMessage = (text) => {
    return text.split("**").map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="text-red-600 font-bold">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Show templates at the top when no messages */}
        {showTemplates && (
          <QuickActions
            onActionPress={onQuickAction}
            isVisible={showTemplates}
          />
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-3 max-w-2xl ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-red-600 text-white"
                    : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              {/* Message */}
              <div
                className={`rounded-2xl px-6 py-4 ${
                  message.sender === "user"
                    ? "bg-red-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md shadow-sm"
                } max-w-lg`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.sender === "ai"
                    ? formatAIMessage(message.text)
                    : message.text}
                </div>

                {/* Trip Save Options */}
                {message.sender === "ai" && message.tripData && (
                  <div className="mt-4 space-y-3">
                    <button
                      onClick={() => handlePreviewTrip(message.tripData)}
                      className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">
                        Preview Trip Plan
                      </span>
                    </button>

                    <button
                      onClick={() => handleSaveTrip(message.tripData)}
                      disabled={savingTrip}
                      className={`w-full py-2 rounded-xl transition-colors ${
                        savingTrip
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      <span className="text-white text-sm font-medium">
                        {savingTrip
                          ? "💾 Saving..."
                          : "💾 Save Without Preview"}
                      </span>
                    </button>
                  </div>
                )}

                <div
                  className={`text-xs mt-3 ${
                    message.sender === "user" ? "text-red-200" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-6 py-4 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-gray-600">
                    Crafting your perfect Cebu itinerary...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Trip Preview Modal */}
      <TripPreviewModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
        tripData={selectedTripData}
        onSave={handleSaveTrip}
        loading={savingTrip}
      />
    </>
  );
};

// Main AIChatbotDesktop Component
const AIChatbotDesktop = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🤖 Hi! I'm your AI Travel Planner. I can create personalized Cebu itineraries with optimized routes and travel times. What kind of trip are you planning?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const chatContainerRef = useRef(null);
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    setShowTemplates(messages.length <= 2 && !isTyping);
  }, [messages.length, isTyping]);

  // Auto-scroll to bottom when new messages come
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, showTemplates]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai_chat_messages");
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      const messagesWithDates = parsedMessages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(messagesWithDates);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
  }, [messages]);

  const clearChatHistory = () => {
    localStorage.removeItem("ai_chat_messages");
    setMessages([messages[0]]); // Keep only the first message
    setShowTemplates(true);
  };

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await ChatService.sendMessage(inputText);

      if (response.success) {
        if (response.type === "trip_plan") {
          // STRUCTURED TRIP PLAN
          const aiMessage = {
            id: Date.now() + 1,
            text: response.message,
            sender: "ai",
            timestamp: new Date(),
            tripData: response.data,
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          // NORMAL CHAT RESPONSE
          const aiMessage = {
            id: Date.now() + 1,
            text: response.message,
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        handleFallbackResponse("AI service might be offline.");
      }
    } catch (error) {
      console.error("❌ AI Error:", error);
      handleFallbackResponse("Failed to connect to AI service");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveTrip = async (tripData) => {
    setSavingTrip(true);

    try {
      console.log("💾 Saving trip to database...", tripData);

      const tripToSave = {
        ...tripData,
        user: user.id,
        generatedByAI: true,
        status: "planned",
        travelers: {
          adults: 1,
          children: 0,
        },
      };

      const result = await TripPlanService.saveTripPlan(tripToSave);

      if (result.success) {
        alert("🎉 Success! Your trip has been saved to Travel Hub!");

        // Remove save button after successful save
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tripData ? { ...msg, showSaveButton: false } : msg
          )
        );
      } else {
        alert("❌ Error: " + (result.message || "Failed to save trip"));
      }
    } catch (error) {
      console.error("❌ Save trip error:", error);
      alert("❌ Error: Failed to save trip to database");
    } finally {
      setSavingTrip(false);
    }
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: Date.now(),
      text: action.prompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await ChatService.sendMessage(action.prompt);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.message,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        handleTemplateFallback(action.title);
      }
    } catch (error) {
      console.error("❌ Quick action error:", error);
      handleTemplateFallback(action.title);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFallbackResponse = (message) => {
    const fallbackMessage = {
      id: Date.now() + 1,
      text: "I'm having trouble connecting right now. Here's a sample Cebu itinerary:\n\n3-Day Cebu Adventure\n• Day 1: City Tour - Magellan's Cross, Fort San Pedro\n• Day 2: South Cebu - Kawasan Falls, Moalboal\n• Day 3: Island Hopping - Hilutungan, Nalusuan\n\nTry again in a moment!",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fallbackMessage]);
    alert("Connection Issue: " + message);
  };

  const handleTemplateFallback = (title) => {
    const fallbackMessage = {
      id: Date.now() + 1,
      text: `🎉 Creating your ${title}...\n\nTell me more:\n• Budget range?\n• Travel dates?\n• Special interests?\n• Number of people?`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fallbackMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed at top */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  AI Trip Planner
                </h1>
                <p className="text-red-600 text-xl font-semibold">
                  Powered by Gemini AI • Create Perfect Cebu Itineraries
                </p>
              </div>
            </div>
            <button
              onClick={clearChatHistory}
              className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-2xl flex items-center space-x-3 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-700">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Flexible height */}
      <div className="flex-1 mx-8 py-6 flex flex-col">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1">
          {/* Chat Area - Scrollable but stays contained */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-8 min-h-0" // min-h-0 allows proper flex sizing
          >
            <MessageList
              messages={messages}
              isTyping={isTyping}
              onSaveTrip={handleSaveTrip}
              savingTrip={savingTrip}
              showTemplates={showTemplates}
              onQuickAction={handleQuickAction}
            />
          </div>

          {/* Input Area - Fixed at bottom of chat container */}
          <div className="border-t border-gray-200 p-6 bg-white rounded-b-2xl flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Describe your dream Cebu trip... (e.g., '3-day beach vacation for 2 people with ₱5,000 budget')"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg placeholder-gray-500"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={inputText.trim() === "" || isTyping}
                className={`px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-200 ${
                  inputText.trim() === "" || isTyping
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg"
                }`}
              >
                <Send className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-lg">Send</span>
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
              Pro tip: Include details like duration, budget, interests, and
              group size for better recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotDesktop;
