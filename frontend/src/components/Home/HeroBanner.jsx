import React from "react";
import { MapPin } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="mx-4 mt-4 mb-6 rounded-3xl overflow-hidden">
      <div
        className="bg-gradient-to-br from-blue-500 to-purple-600 h-48 md:h-56 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">
            Cebu, Philippines
          </h1>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm md:text-base ml-1">
              Explore beautiful destinations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
