import React, { useState } from "react";
import DiscoverMobile from "../../Mobile/DiscoverMobile";
import DiscoverDesktop from "../../Desktop/DiscoverDesktop";
import { useSpots } from "../../../hooks/useSpots";
import cultural_heritage from "../../../assets/discover_images/cultural_heritage.png";
import best_of_cebu from "../../../assets/discover_images/best_of_cebu.png";
import beach_paradise from "../../../assets/discover_images/beach_paradise.png";

export default function Discover() {
  const [activeTab, setActiveTab] = useState("collections");

  // Use the spots hook - this handles all spot-related data
  const {
    spots: destinations, // ✅ Use allSpots which contains ALL the data
    selectedCategory: activeCategory,
    searchQuery,
    loading,
    error,
    setSelectedCategory: setActiveCategory,
    handleSearch,
    handleCategoryFilter,
    setSearchQuery,
    refreshSpots,
    spotsCount,
  } = useSpots("all");

  // Your static collections data (keep this as is)
  const collections = [
    {
      id: 1,
      title: "Best of Cebu",
      subtitle: `${spotsCount}+ Places, 84 collections`,
      detail: "JAN 13-14 • 4 hr 33 min",
      image: best_of_cebu,
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Beach Paradise",
      subtitle: "150+ Places, 62 collections",
      detail: "ALL YEAR • 3 hr 15 min",
      image: beach_paradise,
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Cultural Heritage",
      subtitle: "95+ Places, 45 collections",
      detail: "WEEKENDS • 2 hr 45 min",
      image: cultural_heritage,
      color: "#FFB347",
    },
  ];

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    handleCategoryFilter(category);
  };

  // Handle search change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <DiscoverMobile
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          collections={collections}
          destinations={destinations}
          loading={loading}
          error={error}
          onRefresh={refreshSpots}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DiscoverDesktop
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          collections={collections}
          destinations={destinations}
          loading={loading}
          error={error}
          onRefresh={refreshSpots}
        />
      </div>
    </>
  );
}
