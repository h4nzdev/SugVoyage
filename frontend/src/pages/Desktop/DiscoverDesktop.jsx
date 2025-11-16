import React from "react";
import {
  Search,
  Grid,
  Sun,
  Book,
  Activity,
  Users,
  Coffee,
  Map,
  Info,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscoverDesktop = ({
  activeTab,
  setActiveTab,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  collections,
  destinations,
  loading = false, // Add these new props
  error = null, // Add these new props
  onRefresh, // Add these new props
}) => {
  const categories = [
    { id: "all", name: "All", icon: Grid },
    { id: "beaches", name: "Beaches", icon: Sun },
    { id: "historical", name: "Historical", icon: Book },
    { id: "adventure", name: "Adventure", icon: Activity },
    { id: "cultural", name: "Cultural", icon: Users },
    { id: "food", name: "Food", icon: Coffee },
  ];

  const tabs = [
    { id: "collections", name: "Collections" },
    { id: "destinations", name: "Destinations" },
  ];

  // Debug: Log the data to see what's coming in
  console.log("📊 DiscoverDesktop received:", {
    destinationsCount: destinations?.length,
    destinations: destinations,
    loading,
    error,
    searchQuery,
    activeCategory,
  });

  // Safe filtering with null checks
  const filteredDestinations =
    destinations?.filter(
      (dest) =>
        dest?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "") &&
        (activeCategory === "all" || dest?.category === activeCategory)
    ) || [];

  const CollectionCard = ({ collection }) => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group">
      <div
        className="h-64 relative bg-cover bg-center flex items-end p-6 transition-transform group-hover:scale-105 duration-300"
        style={{ backgroundImage: `url('${collection.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative text-white">
          <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
          <p className="text-white/90 text-sm mb-1">{collection.subtitle}</p>
          <p className="text-white/80 text-xs">{collection.detail}</p>
        </div>
        <div className="absolute bottom-6 right-6">
          <div className="bg-white px-4 py-2 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">
            <span className="text-sm font-bold">Explore Collection</span>
          </div>
        </div>
      </div>
    </div>
  );

  const DestinationCard = ({ destination }) => {
    const navigate = useNavigate();
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group">
        <div className="relative">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
            }}
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-red-600 text-xs font-bold capitalize">
              {destination.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-semibold">{destination.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-gradient-to-t from-black/80 to-transparent p-3 rounded-lg">
              <h4 className="text-white font-bold text-lg mb-1">
                {destination.name}
              </h4>
              <div className="flex items-center text-white/90">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="text-xs">{destination.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {destination.description}
          </p>

          <div className="flex justify-between items-center mb-3">
            <div className="bg-red-50 px-3 py-1 rounded-lg">
              <span className="text-red-700 text-sm font-bold">
                {destination.price}
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-3 h-3 mr-1" />
              <span>{destination.distance}</span>
              <span className="mx-1">•</span>
              <span>{destination.days}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {destination.activities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {activity}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate(`/main/detailed-info/${destination._id}`)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Loading Destinations
      </h3>
      <p className="text-gray-500">Discovering amazing places in Cebu...</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-500 mb-4">{error}</p>
      <button
        onClick={onRefresh}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        No Destinations Found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Try adjusting your search or filters to discover more amazing places in
        Cebu.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Cebu
          </h1>
          <p className="text-gray-600">
            Explore the best destinations, collections, and hidden gems
          </p>
        </div>

        {/* Search and Tabs */}
        <div className="flex gap-6 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl px-6 py-4 flex items-center shadow-sm border border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, activities, collections..."
                className="flex-1 ml-4 text-lg bg-transparent outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery?.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Map Button */}
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-colors shadow-lg">
            <Map className="w-5 h-5" />
            <span className="font-semibold">View Map</span>
          </button>
        </div>

        {/* Tabs and Categories */}
        <div className="flex gap-8 mb-8">
          {/* Tabs */}
          <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
            {tabs.map((tab) => {
              const TabIcon = tab.id === "collections" ? Grid : Map;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span className="font-semibold">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Categories Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 font-medium">Filter by:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white shadow-md"
                          : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "collections" && (
          <div className="grid grid-cols-2 gap-6 mb-8">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}

        {activeTab === "destinations" && (
          <>
            {/* Show loading state */}
            {loading && <LoadingState />}

            {/* Show error state */}
            {error && !loading && <ErrorState />}

            {/* Show destinations when not loading and no error */}
            {!loading && !error && (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeCategory === "all"
                        ? "All Destinations"
                        : `${
                            categories.find((c) => c.id === activeCategory)
                              ?.name
                          } in Cebu`}
                    </h2>
                    <p className="text-gray-500">
                      {filteredDestinations.length} amazing places to explore
                    </p>
                  </div>
                </div>

                {/* Destinations Grid */}
                {filteredDestinations.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {filteredDestinations.map((destination) => (
                      <DestinationCard
                        key={destination._id || destination.id}
                        destination={destination}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}
          </>
        )}

        {/* Bottom Sections */}
        <div className="grid grid-cols-2 gap-8">
          {/* Local Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">
                  Local Tip
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Visit waterfalls early in the morning to avoid crowds and
                  enjoy the serene atmosphere. For beach destinations, late
                  afternoon (3-5PM) offers perfect golden hour lighting for
                  photos and comfortable swimming conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Trending in Cebu
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "Sunset Spots",
                "Budget Friendly",
                "Family Friendly",
                "Local Food",
                "Hidden Gems",
                "Adventure",
                "Cultural Sites",
                "Island Hopping",
              ].map((tag, index) => (
                <button
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverDesktop;
