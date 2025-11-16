// hooks/useSpots.js
import { useState, useEffect } from "react";
import { CebuSpotsService } from "../services/cebuSpotService";

export const useSpots = (initialCategory = "All") => {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all spots on mount
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching spots from API...");

        const apiSpots = await CebuSpotsService.getAllCebuSpots();

        if (apiSpots && apiSpots.length > 0) {
          console.log(`✅ Successfully fetched ${apiSpots.length} spots`);
          setSpots(apiSpots);
          setFilteredSpots(apiSpots);
        } else {
          console.log("⚠️ No data from API");
          setError("No spots data available");
        }
      } catch (err) {
        console.error("❌ Error fetching spots:", err);
        setError("Failed to load spots");
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  // Filter spots when category or search changes
  useEffect(() => {
    let filtered = spots;

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (spot) =>
          spot?.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (spot) =>
          spot.name?.toLowerCase().includes(query) ||
          spot.location?.toLowerCase().includes(query) ||
          spot.description?.toLowerCase().includes(query) ||
          spot.category?.toLowerCase().includes(query)
      );
    }

    setFilteredSpots(filtered);
  }, [selectedCategory, searchQuery, spots]);

  // Search function
  const handleSearch = async (query) => {
    setSearchQuery(query);

    // If you want to use API search instead of client-side:
    /*
    if (!query.trim()) {
      setFilteredSpots(spots);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await CebuSpotsService.searchSpots(query);
      setFilteredSpots(searchResults);
    } catch (err) {
      console.error("❌ Error searching spots:", err);
      // Fallback to client-side search (handled by useEffect above)
      setSearchQuery(query);
    } finally {
      setLoading(false);
    }
    */
  };

  // Category filter function
  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);

    // If you want to use API category filtering:
    /*
    if (category === "All") {
      setFilteredSpots(spots);
      return;
    }

    try {
      setLoading(true);
      const categorySpots = await CebuSpotsService.searchByCategory(category.toLowerCase());
      setFilteredSpots(categorySpots);
    } catch (err) {
      console.error("❌ Error filtering by category:", err);
      // Fallback to client-side filtering (handled by useEffect above)
      setSelectedCategory(category);
    } finally {
      setLoading(false);
    }
    */
  };

  // Refresh function
  const refreshSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiSpots = await CebuSpotsService.getAllCebuSpots();

      if (apiSpots && apiSpots.length > 0) {
        setSpots(apiSpots);
      }
    } catch (err) {
      console.error("❌ Error refreshing spots:", err);
      setError("Failed to refresh spots");
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    // State
    spots,
    allSpots: spots,
    selectedCategory,
    searchQuery,
    loading,
    error,

    // Actions
    setSelectedCategory,
    handleSearch,
    handleCategoryFilter,
    refreshSpots,
    clearSearch,
    setSearchQuery,

    // Utilities
    hasSpots: filteredSpots.length > 0,
    spotsCount: filteredSpots.length,
  };
};
