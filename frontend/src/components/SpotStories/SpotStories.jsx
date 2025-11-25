// components/NotificationPopup/SpotStories/SpotStories.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MapPin, Clock } from "lucide-react";

// Static sample stories for demonstration
const SAMPLE_STORIES = {
  "Magellan's Cross": {
    title: "Magellan's Cross",
    location: "Cebu City",
    duration: "5 min read",
    story: `In the heart of Cebu City stands Magellan's Cross, planted by Portuguese explorer Ferdinand Magellan in 1521. This simple wooden cross marks the spot where the first Christian Filipinos were baptized, beginning over 400 years of Spanish influence.

The cross you see today is encased in hollow tindalo wood to protect the original, which many believe possesses miraculous healing powers. Locals say fragments of the original cross continue to work wonders.

Every April, the city comes alive during the Sinulog Festival, celebrating the Santo Niño that Magellan gave to Queen Juana. The cross remains a silent witness to Cebu's transformation from a small native settlement to the "Queen City of the South."`,
  },
  "Taoist Temple": {
    title: "Taoist Temple",
    location: "Beverly Hills, Cebu",
    duration: "4 min read",
    story: `Perched in the affluent Beverly Hills neighborhood, the Cebu Taoist Temple stands as a beautiful symbol of the city's Chinese-Filipino community. Built in 1972, this temple serves the large Chinese population in Cebu.

Visitors must climb 81 steps representing the 81 chapters of Taoist scriptures. The main temple features a magnificent chapel, a library, and a wishing well where devotees throw coins for good luck.

The temple offers breathtaking panoramic views of Cebu City, especially during sunrise when the morning mist creates an ethereal atmosphere. It's a peaceful oasis where the chants of Taoist priests blend with the city sounds below.`,
  },
  "Fort San Pedro": {
    title: "Fort San Pedro",
    location: "Cebu City",
    duration: "6 min read",
    story: `Fort San Pedro is the smallest and oldest triangular bastion fort in the Philippines. Built in 1565 under Miguel López de Legazpi, it served as the nucleus of the first Spanish settlement in Cebu.

During its long history, the fort has been a Spanish stronghold, American barracks, Japanese prison camp, and even a zoo. Today, it houses a museum displaying Spanish artifacts, including canons and documents from the colonial era.

The fort's gardens are particularly enchanting at dusk, when the stone walls glow in the setting sun. It's said that on quiet nights, you can still hear echoes of Spanish soldiers marching through the courtyards.`,
  },
};

export default function SpotStories({ spot, isOpen, onClose, categoryInfo }) {
  const storyData = SAMPLE_STORIES[spot] || {
    title: spot,
    location: "Cebu",
    duration: "3 min read",
    story: `Discover the rich history and cultural significance of ${spot}, one of Cebu's most fascinating destinations. This location tells a story of heritage, tradition, and the vibrant spirit of the Filipino people.

As you explore this remarkable place, imagine the generations of visitors who have stood where you stand now, each adding to the tapestry of stories that make Cebu such a special destination.

The beauty of ${spot} lies not just in its physical presence, but in the memories and experiences it creates for every traveler who visits.`,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header - Using category colors */}
            <div
              className={`bg-gradient-to-r ${categoryInfo.color} p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles size={24} />
                  <div>
                    <h2 className="text-xl font-bold">AI Storyteller</h2>
                    <p className="text-white text-opacity-90">
                      Discover the story behind this place
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {storyData.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{storyData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{storyData.duration}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {storyData.story}
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Sparkles size={16} />
                  <span className="font-semibold">AI Generated Story</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  This story was generated to help you appreciate the cultural
                  significance of this location.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={onClose}
                className={`w-full bg-gradient-to-r ${categoryInfo.color} text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all`}
              >
                Close Story
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
