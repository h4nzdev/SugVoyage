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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscoverMobile = ({
  activeTab,
  setActiveTab,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  collections,
  destinations,
}) => {
  const navigate = useNavigate();
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

  const filteredDestinations = destinations?.filter(
    (dest) =>
      dest.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeCategory === "all" || dest.category === activeCategory)
  );

  const CollectionCard = ({ collection }) => (
    <div className="bg-white rounded-3xl overflow-hidden mb-4 mx-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      <div
        className="h-48 relative bg-cover bg-center flex items-end p-5"
        style={{ backgroundImage: `url('${collection.image}')` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-white">
          <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
          <p className="text-white/90 text-sm mb-1">{collection.subtitle}</p>
          <p className="text-white/80 text-xs">{collection.detail}</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-white px-4 py-2 rounded-full">
            <span className="text-gray-900 text-sm font-bold">Explore</span>
          </div>
        </div>
      </div>
    </div>
  );

  const GridCard = ({ destination }) => (
    <div className="bg-white rounded-3xl overflow-hidden mb-4 mx-2 flex shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer h-48">
      <div className="w-32 relative flex-shrink-0">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full">
          <span className="text-red-600 text-[10px] font-bold capitalize">
            {destination.category}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-black/70 px-2 py-1 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-[10px] font-semibold ml-1">
              {destination.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h4 className="text-gray-900 font-bold text-sm line-clamp-1">
            {destination.name}
          </h4>
          <div className="flex items-center mb-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-gray-500 text-xs ml-1 line-clamp-1">
              {destination.location}
            </span>
          </div>
          <p className="text-gray-600 text-[11px] leading-4 line-clamp-2">
            {destination.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="bg-red-50 px-2 py-1 rounded-lg">
            <span className="text-red-700 text-xs font-bold">
              {destination.price}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-500 text-xs ml-1">
              {destination.distance}
            </span>
            <div className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
            <span className="text-gray-500 text-xs">{destination.days}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {destination.activities.slice(0, 2).map((activity, index) => (
              <div key={index} className="bg-gray-100 px-2 py-1 rounded-lg">
                <span className="text-gray-600 text-[10px] line-clamp-1">
                  {activity}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate(`/main/detailed-info/${destination._id}`)}
            className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <ArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        No Destinations Found
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        Try a different search or category to discover more places
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="px-5 mt-2 mb-4">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations, activities..."
            className="flex-1 ml-3 text-sm bg-transparent outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery?.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="px-5 mb-4">
        <div className="flex bg-white rounded-2xl p-1">
          {tabs.map((tab) => {
            const TabIcon = tab.id === "collections" ? Grid : Map;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id ? "bg-red-600" : "hover:bg-gray-100"
                }`}
              >
                <TabIcon
                  className={`w-4 h-4 ${
                    activeTab === tab.id ? "text-white" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-bold ${
                    activeTab === tab.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collections View */}
      {activeTab === "collections" && (
        <div className="mb-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Destinations View */}
      {activeTab === "destinations" && (
        <>
          {/* Categories */}
          <div className="mb-5">
            <div className="flex space-x-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
              {categories?.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 rounded-2xl px-4 py-3 flex-shrink-0 transition-all ${
                      activeCategory === category.id
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white text-gray-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Header */}
          <div className="px-5 mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {activeCategory === "all"
                    ? "All Destinations"
                    : categories.find((c) => c.id === activeCategory)?.name}
                </h2>
                <p className="text-sm text-gray-500">{`${filteredDestinations.length} places found`}</p>
              </div>
              <button className="flex items-center bg-red-600 px-4 py-2 rounded-full text-white hover:bg-red-700 transition-colors">
                <Map className="w-4 h-4" />
                <span className="text-sm ml-2 font-semibold">Map</span>
              </button>
            </div>
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length > 0 && (
            <div className="px-2 mb-6">
              <div className="space-y-4">
                {filteredDestinations.map((destination) => (
                  <GridCard key={destination.id} destination={destination} />
                ))}
              </div>
            </div>
          )}

          {filteredDestinations.length === 0 && <EmptyState />}
        </>
      )}

      {/* Local Tips */}
      <div className="px-5 mt-2 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
              <Info className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base mb-1 text-gray-900">
                Local Tip
              </h3>
              <p className="text-sm text-gray-600">
                Visit waterfalls in the morning to avoid crowds! Beaches are
                perfect from 3-5PM for golden hour photos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Searches */}
      <div className="px-5 mb-8">
        <h2 className="text-lg font-bold mb-3 text-gray-900">
          Trending in Cebu
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Sunset Spots",
            "Budget Friendly",
            "Family Friendly",
            "Local Food",
            "Hidden Gems",
          ].map((tag, index) => (
            <button
              key={index}
              className="bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-gray-700">#{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverMobile;
