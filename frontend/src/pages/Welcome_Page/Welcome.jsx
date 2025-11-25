import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Palette,
  Mountain,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

const Welcome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedPreference, setSelectedPreference] = useState("");
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  // Cultural Cebu color palette
  const culturalColors = {
    primary: "#DC2626", // Deep red
    secondary: "#D97706", // Amber/orange
    accent: "#059669", // Emerald green
    background: "#FEF7ED", // Warm cream
    text: "#1F2937", // Dark gray
  };

  const preferences = [
    {
      icon: <Utensils className="w-8 h-8" />,
      label: "Food Explorer",
      description: "Taste Cebu's famous flavors",
      color: culturalColors.primary,
    },
    {
      icon: <Palette className="w-8 h-8" />,
      label: "Culture Seeker",
      description: "Discover rich heritage",
      color: culturalColors.secondary,
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      label: "Adventure Lover",
      description: "Explore natural wonders",
      color: culturalColors.accent,
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      label: "Beach Wanderer",
      description: "Relax by pristine shores",
      color: culturalColors.primary,
    },
  ];

  const famousSpots = {
    "Food Explorer": [
      {
        id: 1,
        name: "CNT Lechon",
        description: "Famous roast pig",
        rating: 4.8,
      },
      {
        id: 2,
        name: "Larsian BBQ",
        description: "Authentic street food",
        rating: 4.5,
      },
      {
        id: 3,
        name: "Sutukil Market",
        description: "Fresh seafood paradise",
        rating: 4.7,
      },
    ],
    "Culture Seeker": [
      {
        id: 1,
        name: "Magellan's Cross",
        description: "Historical landmark",
        rating: 4.6,
      },
      {
        id: 2,
        name: "Fort San Pedro",
        description: "Spanish-era fortress",
        rating: 4.4,
      },
      {
        id: 3,
        name: "Taoist Temple",
        description: "Beautiful religious site",
        rating: 4.5,
      },
    ],
    "Adventure Lover": [
      {
        id: 1,
        name: "Kawasan Falls",
        description: "Turquoise waterfalls",
        rating: 4.9,
      },
      {
        id: 2,
        name: "Osmeña Peak",
        description: "Highest mountain in Cebu",
        rating: 4.7,
      },
      {
        id: 3,
        name: "Moalboal Sardines",
        description: "Amazing snorkeling",
        rating: 4.8,
      },
    ],
    "Beach Wanderer": [
      {
        id: 1,
        name: "Bantayan Island",
        description: "White sand paradise",
        rating: 4.9,
      },
      {
        id: 2,
        name: "Malapascua Island",
        description: "Crystal clear waters",
        rating: 4.8,
      },
      {
        id: 3,
        name: "Sumilon Island",
        description: "Private beach getaway",
        rating: 4.7,
      },
    ],
  };

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreferenceSelect = (preference) => {
    setSelectedPreference(preference);
    nextStep();
  };

  const handleSpotSelect = (spotId) => {
    setSelectedSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  if (showSplash) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: culturalColors.background }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1.5 }}
            className="text-6xl mb-4 flex items-center justify-center bg-red-500 rounded-full"
          >
            <img src={logo} className="w-20 h-20" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-2"
            style={{ color: culturalColors.primary }}
          >
            SugBoyage
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg"
            style={{ color: culturalColors.text }}
          >
            Welcome to Cebu
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: culturalColors.background }}
    >
      {/* Floating AI Chatbot Icon */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        style={{ backgroundColor: culturalColors.primary }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* AI Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="font-semibold"
                  style={{ color: culturalColors.primary }}
                >
                  Cebu AI Guide
                </h3>
                <button onClick={() => setShowChatbot(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Ask me anything about Cebu! I can help you plan your adventure.
              </p>
              <input
                type="text"
                placeholder="Ask about Cebu..."
                className="w-full p-3 border rounded-lg text-sm"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cultural Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(${culturalColors.primary} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8 max-w-md mx-auto">
            <motion.div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: culturalColors.primary,
                width: `${(currentStep + 1) * 25}%`,
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-8"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-8xl mb-4 flex justify-center items-center"
                >
                  <svg
                    width="256px"
                    height="256px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#c80000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke="#CCCCCC"
                      stroke-width="1.7759999999999998"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M6 19L18 19"
                        stroke="#c80000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M16.5585 16H7.44152C6.58066 16 5.81638 15.4491 5.54415 14.6325L3.70711 9.12132C3.44617 8.3385 4.26195 7.63098 5 8L5.71067 8.35533C6.48064 8.74032 7.41059 8.58941 8.01931 7.98069L10.5858 5.41421C11.3668 4.63317 12.6332 4.63316 13.4142 5.41421L15.9807 7.98069C16.5894 8.58941 17.5194 8.74032 18.2893 8.35533L19 8C19.7381 7.63098 20.5538 8.3385 20.2929 9.12132L18.4558 14.6325C18.1836 15.4491 17.4193 16 16.5585 16Z"
                        stroke="#c80000"
                        stroke-width="2"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </motion.div>

                <div>
                  <h1
                    className="text-5xl font-bold mb-4"
                    style={{ color: culturalColors.primary }}
                  >
                    Welcome to Cebu
                  </h1>
                  <p
                    className="text-xl mb-8 opacity-80"
                    style={{ color: culturalColors.text }}
                  >
                    Where every moment becomes a beautiful memory
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="px-12 py-4 rounded-full text-lg font-semibold mx-auto shadow-lg hover:shadow-xl transition-all"
                  style={{
                    backgroundColor: culturalColors.primary,
                    color: "white",
                  }}
                >
                  Begin Your Journey
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Preferences - Full Screen Grid */}
            {currentStep === 1 && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: culturalColors.text }}
                  >
                    Choose Your Adventure
                  </h2>
                  <p
                    className="text-lg opacity-70"
                    style={{ color: culturalColors.text }}
                  >
                    What calls to your heart?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {preferences.map((pref, index) => (
                    <motion.button
                      key={pref.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreferenceSelect(pref.label)}
                      className="p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-lg border-2"
                      style={{
                        borderColor: pref.color,
                        backgroundColor: "white",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${pref.color}20` }}
                        >
                          <div style={{ color: pref.color }}>{pref.icon}</div>
                        </div>
                        <div>
                          <h3
                            className="font-semibold text-lg mb-1"
                            style={{ color: culturalColors.text }}
                          >
                            {pref.label}
                          </h3>
                          <p
                            className="text-sm opacity-70"
                            style={{ color: culturalColors.text }}
                          >
                            {pref.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Spot Selection */}
            {currentStep === 2 && (
              <motion.div
                key="spots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="text-center">
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: culturalColors.text }}
                  >
                    Discover Gems
                  </h2>
                  <p
                    className="text-lg opacity-70"
                    style={{ color: culturalColors.text }}
                  >
                    Select places that spark your curiosity
                  </p>
                </div>

                <div className="space-y-4">
                  {famousSpots[selectedPreference]?.map((spot, index) => (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSpotSelect(spot.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedSpots.includes(spot.id)
                          ? "shadow-lg scale-105"
                          : "hover:shadow-md"
                      }`}
                      style={{
                        borderColor: selectedSpots.includes(spot.id)
                          ? culturalColors.primary
                          : "#E5E7EB",
                        backgroundColor: "white",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3
                            className="font-semibold text-lg"
                            style={{ color: culturalColors.text }}
                          >
                            {spot.name}
                          </h3>
                          <p
                            className="text-sm opacity-70"
                            style={{ color: culturalColors.text }}
                          >
                            {spot.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          ⭐ {spot.rating}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  disabled={selectedSpots.length === 0}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    selectedSpots.length > 0
                      ? "shadow-lg hover:shadow-xl"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor:
                      selectedSpots.length > 0
                        ? culturalColors.primary
                        : "#9CA3AF",
                    color: "white",
                  }}
                >
                  Continue to Your Story
                </motion.button>
              </motion.div>
            )}

            {/* Step 4: Final Step */}
            {currentStep === 3 && (
              <motion.div
                key="final"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-8 max-w-2xl mx-auto"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2 }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>

                <div>
                  <h2
                    className="text-4xl font-bold mb-4"
                    style={{ color: culturalColors.primary }}
                  >
                    Your Cebu Adventure Awaits!
                  </h2>
                  <p
                    className="text-lg opacity-80 mb-6"
                    style={{ color: culturalColors.text }}
                  >
                    We've prepared personalized stories and recommendations
                    based on your choices
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3
                    className="font-semibold text-lg mb-4"
                    style={{ color: culturalColors.primary }}
                  >
                    Your Selected Journey:
                  </h3>
                  <div className="space-y-2 text-left">
                    {famousSpots[selectedPreference]
                      ?.filter((spot) => selectedSpots.includes(spot.id))
                      .map((spot) => (
                        <div
                          key={spot.id}
                          className="flex items-center gap-3 py-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: culturalColors.primary }}
                          />
                          <span style={{ color: culturalColors.text }}>
                            {spot.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/home")}
                  className="px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{
                    backgroundColor: culturalColors.primary,
                    color: "white",
                  }}
                >
                  Enter SugBoyage
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
