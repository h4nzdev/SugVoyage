import React from "react";
import HomePageMobile from "../../Mobile/HomePageMobile";
import HomePageDesktop from "../../Desktop/HomePageDesktop";
import { useSpots } from "../../../hooks/useSpots"; // Import the hook

const categories = [
  { name: "All" },
  { name: "Cultural" },
  { name: "Historical" },
  { name: "Adventure" },
  { name: "Beach" },
  { name: "Nature" },
  { name: "Religious" },
  { name: "Urban" },
];

export default function HomePage() {
  // Use the hook - everything is handled here!
  const {
    spots,
    selectedCategory,
    loading,
    error,
    setSelectedCategory,
    handleSearch,
    handleCategoryFilter,
    refreshSpots,
  } = useSpots("All"); // Initial category

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <HomePageMobile
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryFilter} // Use the hook's function
          spots={spots}
          categories={categories}
          loading={loading}
          error={error}
          onSearch={handleSearch}
          onRefresh={refreshSpots}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <HomePageDesktop
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryFilter} // Use the hook's function
          spots={spots}
          categories={categories}
          loading={loading}
          error={error}
          onSearch={handleSearch}
          onRefresh={refreshSpots}
        />
      </div>
    </>
  );
}
