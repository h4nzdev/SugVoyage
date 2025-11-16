import React from "react";
import { MapPin } from "lucide-react";

const MapSection = ({ spots }) => {
  return (
    <div className="px-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Explore Map</h2>
        <div className="bg-red-600 px-3 py-1 rounded-full flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl overflow-hidden h-64 shadow-md border border-gray-200">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center">
          {/* Static map representation */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')] bg-cover bg-center opacity-20" />

          {/* User location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            {/* Pulsing effect */}
            <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>

          {/* Spot markers */}
          {spots.map((spot, index) => (
            <div
              key={spot.id}
              className="absolute"
              style={{
                left: `${50 + Math.cos(index * 1.2) * 30}%`,
                top: `${50 + Math.sin(index * 1.2) * 30}%`,
              }}
            >
              <div className="w-6 h-6 bg-red-300 rounded-full border border-red-500 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
                <MapPin className="w-3 h-3 text-red-600" />
              </div>
            </div>
          ))}

          <div className="relative bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm text-gray-700 font-medium">
              Interactive Map View
            </p>
            <p className="text-xs text-gray-500">
              Showing {spots.length} attractions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
