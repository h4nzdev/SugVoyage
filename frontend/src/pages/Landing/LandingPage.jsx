import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Star,
  Navigation,
  Search,
  X,
  ExternalLink,
  Compass,
  Sparkles,
  Menu,
  Trees,
  Zap,
  Utensils,
  Mountain,
  Waves,
  Castle,
  Navigation2,
} from "lucide-react";
import { CebuSpotsService } from "../../services/cebuSpotService";
import logo from "../../assets/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
  });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [spotsWithinRadius, setSpotsWithinRadius] = useState([]);
  const [allSpots, setAllSpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Castle className="w-8 h-8 md:w-12 md:h-12" />,
      title: "Sacred Heritage",
      description:
        "Discover Cebu's spiritual landmarks and historical sites that shaped our rich cultural identity through centuries.",
    },
    {
      icon: <Mountain className="w-8 h-8 md:w-12 md:h-12" />,
      title: "Island Adventures",
      description:
        "Explore pristine beaches, lush mountains, and hidden natural wonders unique to our beautiful island.",
    },
    {
      icon: <Utensils className="w-8 h-8 md:w-12 md:h-12" />,
      title: "Culinary Stories",
      description:
        "Taste authentic Cebu flavors - from local delicacies to traditional recipes passed down through generations.",
    },
    {
      icon: <Waves className="w-8 h-8 md:w-12 md:h-12" />,
      title: "Living Culture",
      description:
        "Experience vibrant festivals, local traditions, and the warmth of Cebuano hospitality firsthand.",
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All Spots",
      icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "historical",
      name: "Historical",
      icon: <Castle className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "nature",
      name: "Nature",
      icon: <Trees className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "adventure",
      name: "Adventure",
      icon: <Zap className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "viewpoint",
      name: "Viewpoints",
      icon: <Mountain className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "beach",
      name: "Beaches",
      icon: <Waves className="w-4 h-4 md:w-5 md:h-5" />,
    },
    {
      id: "food",
      name: "Food",
      icon: <Utensils className="w-4 h-4 md:w-5 md:h-5" />,
    },
  ];

  const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 2000, label: "2 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 50000, label: "50 km" },
  ];

  const culturalStories = [
    {
      id: 1,
      title: "Santo Niño: Our Beloved Saint",
      excerpt:
        "The heart of Cebu's faith and identity, celebrated with devotion and joy",
      category: "Spiritual Heritage",
      image: `https://artecatolica.com/cdn/shop/products/1817EF09-7E61-4C50-BCFA-C9E01EE6956A_300x300.png?v=1591327986`,
    },
    {
      id: 2,
      title: "Island Festivals & Traditions",
      excerpt:
        "From Sinulog to local celebrations, discover the vibrant spirit of Cebuano culture",
      category: "Cultural Events",
      image: `https://www.samseophilippines.com/wp-content/uploads/2024/02/The-Santo-Nino-and-the-Dance-of-Devotion.jpg`,
    },
    {
      id: 3,
      title: "Local Flavors & Tastes",
      excerpt:
        "Explore the culinary treasures that define Cebuano cuisine and hospitality",
      category: "Food Heritage",
      image: `https://www.thefooddictator.com/wp-content/uploads/2019/01/cebulechon-1200x799.jpg`,
    },
  ];

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        console.log("Loading spots from service...");

        const spotsData = await CebuSpotsService.getAllCebuSpots();
        console.log("Spots loaded:", spotsData);

        setAllSpots(spotsData);
        setNotificationMessage(
          `Welcome! Discover ${spotsData.length} amazing spots in Cebu`
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } catch (error) {
        console.error("Error loading spots:", error);
        setNotificationMessage("Welcome to SugVoyage! Start exploring Cebu");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);

        // Fallback to empty array if service fails
        setAllSpots([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, []);

  useEffect(() => {
    if (allSpots.length === 0) {
      setSpotsWithinRadius([]);
      return;
    }

    console.log("Filtering spots...", allSpots.length, "total spots");

    const filtered = allSpots
      .filter((spot) => {
        // Check if spot has coordinates
        if (!spot.latitude || !spot.longitude) {
          console.log("Spot missing coordinates:", spot.name);
          return false;
        }

        // Calculate distance
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        );

        // Search filter
        const matchesSearch = spot.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          activeCategory === "all" ||
          spot.category === activeCategory ||
          spot.type === activeCategory;

        // Radius filter
        const withinRadius = distance <= radius;

        console.log(
          `Spot: ${spot.name}, Distance: ${distance}m, Within Radius: ${withinRadius}, Matches Category: ${matchesCategory}`
        );

        return matchesSearch && matchesCategory && withinRadius;
      })
      .map((spot) => ({
        ...spot,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    console.log("Filtered spots:", filtered.length);
    setSpotsWithinRadius(filtered);
  }, [userLocation, radius, searchQuery, activeCategory, allSpots]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setNotificationMessage(
            "📍 Location updated! Discovering nearby treasures..."
          );
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        },
        (error) => {
          setNotificationMessage("Exploring Cebu from City Center");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      );
    }
  };

  const SimpleMap = () => (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-red-200 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          Explore on Map
        </h3>
        <button
          onClick={getUserLocation}
          className="flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg text-sm md:text-base"
        >
          <Navigation size={16} className="md:w-[18px]" />
          Use My Location
        </button>
      </div>

      <div className="h-64 md:h-80 rounded-2xl mb-4 md:mb-6 relative overflow-hidden border-2 border-red-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125433.1703112711!2d123.79228605!3d10.359061499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999258eb9a9a7%3A0x6d1a1a1e4ddce242!2sCebu%20City%2C%20Cebu!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Cebu City Map"
        ></iframe>
      </div>

      <button
        onClick={() => navigate("/auth/login")}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 md:py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-base md:text-lg shadow-lg"
      >
        Start Your Cebu Journey - Login Now
      </button>
    </div>
  );

  const SpotList = () => (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-red-200 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Discover Cebu's Treasures
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            {spotsWithinRadius.length} amazing places found within{" "}
            {radius / 1000}km
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search spots..."
              className="pl-10 pr-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent w-full text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="border-2 border-red-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm md:text-base w-full md:w-auto"
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-4 -mx-4 md:mx-0 px-4 md:px-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 text-sm font-medium flex-shrink-0 ${
              activeCategory === category.id
                ? "bg-red-600 text-white shadow-lg"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            <span
              className="text-red-600"
              style={activeCategory === category.id ? { color: "white" } : {}}
            >
              {category.icon}
            </span>
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden text-xs">
              {category.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 md:py-16">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base md:text-lg">
            Loading Cebu's treasures...
          </p>
        </div>
      )}

      {!loading && spotsWithinRadius.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          <Compass className="w-12 h-12 md:w-16 md:h-16 text-red-300 mx-auto mb-4" />
          <p className="text-gray-600 text-base md:text-lg mb-2">
            No spots found nearby
          </p>
          <p className="text-gray-500 text-sm md:text-base">
            Try increasing the search radius or exploring different categories
          </p>
        </div>
      ) : (
        <>
          {/* Mobile - Horizontal Carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide">
              {spotsWithinRadius.map((spot) => (
                <div
                  key={spot._id || spot.id}
                  className="w-80 flex-shrink-0 snap-start group border-2 border-red-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-red-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white flex flex-col h-full"
                >
                  <div className="relative flex-shrink-0 bg-gradient-to-br from-red-100 to-orange-100">
                    <img
                      src={spot.image_url || spot.image}
                      alt={spot.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1545562083-a600704fa486?w=400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {spot.featured && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles size={12} />
                        Featured
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {Math.round(spot.distance / 1000)}km
                        </span>
                        <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-semibold">
                            {spot.rating || "4.0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                      {spot.name}
                    </h4>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                      {spot.description ||
                        "Discover this amazing spot in beautiful Cebu"}
                    </p>

                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200">
                        <MapPin size={12} />
                        {spot.category || spot.type || "Adventure"}
                      </span>
                      {spot.price && (
                        <span className="text-green-600 font-bold text-sm">
                          {spot.price}
                        </span>
                      )}
                    </div>

                    {spot.activities && spot.activities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {spot.activities
                            .slice(0, 3)
                            .map((activity, index) => (
                              <span
                                key={index}
                                className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium border border-red-200"
                              >
                                {activity}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => setSelectedSpot(spot)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold group/btn text-sm"
                      >
                        Learn More
                        <ExternalLink
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop - Grid Layout */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {spotsWithinRadius.map((spot) => (
              <div
                key={spot._id || spot.id}
                className="group border-2 border-red-100 hover:border-red-300 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white flex flex-col h-full"
              >
                <div className="relative flex-shrink-0 bg-gradient-to-br from-red-100 to-orange-100">
                  <img
                    src={spot.image_url || spot.image}
                    alt={spot.name}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1545562083-a600704fa486?w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {spot.featured && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles size={12} />
                      Featured
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {Math.round(spot.distance / 1000)}km
                      </span>
                      <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs md:text-sm font-semibold">
                          {spot.rating || "4.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                    {spot.name}
                  </h4>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {spot.description ||
                      "Discover this amazing spot in beautiful Cebu"}
                  </p>

                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200">
                      <MapPin size={12} />
                      {spot.category || spot.type || "Adventure"}
                    </span>
                    {spot.price && (
                      <span className="text-green-600 font-bold text-sm">
                        {spot.price}
                      </span>
                    )}
                  </div>

                  {spot.activities && spot.activities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {spot.activities.slice(0, 3).map((activity, index) => (
                          <span
                            key={index}
                            className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium border border-red-200"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setSelectedSpot(spot)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold group/btn text-sm"
                    >
                      Learn More
                      <ExternalLink
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in max-w-sm md:max-w-md mx-auto text-sm md:text-base">
          <Sparkles size={20} className="flex-shrink-0" />
          <span className="font-semibold">{notificationMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-red-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl bg-cover"
                style={{ backgroundImage: `url(${logo})` }}
              />
              <div>
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  SugVoyage
                </span>
                <p className="text-xs text-gray-600 -mt-1 hidden md:block font-medium">
                  Experience Cebu's Soul
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a
                href="#stories"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Stories
              </a>
              <a
                href="#spots"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Discover
              </a>
              <a
                href="#culture"
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Culture
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/auth/login")}
                className="hidden md:block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg text-sm md:text-base"
              >
                Explore Now
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Menu size={24} className="text-red-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t-2 border-red-200 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <a
                  href="#stories"
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
                >
                  Stories
                </a>
                <a
                  href="#spots"
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
                >
                  Discover
                </a>
                <a
                  href="#culture"
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
                >
                  Culture
                </a>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg text-sm md:text-base"
                >
                  Explore Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Cultural Background */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-32 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-semibold border border-red-300">
                <Sparkles size={16} />
                Discover Cebu's Untold Stories
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Experience the{" "}
                <span className="text-red-600">Heart of Cebu</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                From sacred heritage sites to hidden island treasures, explore
                the rich cultural tapestry and natural beauty that make Cebu
                extraordinary. Every corner has a story waiting to be
                discovered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 md:px-10 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-2xl flex items-center justify-center gap-2"
                >
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-red-300 text-red-700 px-8 md:px-10 py-4 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300 font-semibold text-lg">
                  Watch Stories
                </button>
              </div>
            </div>

            {/* Cultural Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-orange-200 rounded-2xl md:rounded-3xl blur-2xl opacity-30"></div>
              <img
                src="https://www.bria.com.ph/wp-content/uploads/2021/10/why-you-should-invest-in-cebu-queen-of-the-south-webp.webp"
                alt="Cebu Cultural Heritage"
                className="relative w-full rounded-2xl md:rounded-3xl shadow-2xl border-4 border-red-100 object-cover h-96 md:h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="py-12 md:py-24 bg-gradient-to-b from-white to-red-50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              Stories from <span className="text-red-600">Cebu</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore narratives of faith, culture, and adventure that shape the
              identity of our island
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {culturalStories.map((story) => (
              <div
                key={story.id}
                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border-2 border-red-100 hover:border-red-300 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-red-100 to-orange-100">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold">
                    {story.category}
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                    {story.excerpt}
                  </p>
                  <button className="text-red-600 font-semibold flex items-center gap-2 group/btn hover:text-red-700">
                    Read Story
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spots Section */}
      <section id="spots" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              Cebu's <span className="text-red-600">Hidden Gems</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover {allSpots.length}+ remarkable destinations with
              AI-powered recommendations and real-time maps
            </p>
          </div>
          <SimpleMap />
          <div className="mt-8 md:mt-12">
            <SpotList />
          </div>
        </div>
      </section>

      <section
        id="culture"
        className="py-12 md:py-24 bg-gradient-to-br from-red-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              What Makes <span className="text-red-600">Cebu Special</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in traditions, flavors, and experiences that
              celebrate the spirit of Cebu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-red-100 hover:border-red-300 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="text-red-600 mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Cultural Flair */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8">
            Ready to Write Your Cebu Story?
          </h2>
          <p className="text-lg md:text-xl text-red-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers discovering the magic of Cebu. Create
            unforgettable memories with our intelligent travel companion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-white text-red-600 px-8 md:px-12 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-lg shadow-2xl"
            >
              Start Exploring Free
            </button>
            <button className="border-2 border-white text-white px-8 md:px-12 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">SugVoyage</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-base">
            Your guide to discovering the authentic soul of Cebu. Experience
            sacred heritage, culinary treasures, and island adventures like
            never before.
          </p>
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-base"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-base"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-base"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-base"
            >
              About
            </a>
          </div>
          <p className="text-sm">
            &copy; 2025 SugVoyage. Celebrating the spirit of Cebu 🌺
          </p>
        </div>
      </footer>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedSpot.image_url || selectedSpot.image}
                alt={selectedSpot.name}
                className="w-full h-48 md:h-80 object-cover rounded-t-2xl md:rounded-t-3xl"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1545562083-a600704fa486?w=400";
                }}
              />
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              >
                <X size={20} />
              </button>
              {selectedSpot.featured && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Sparkles size={16} />
                  Featured Spot
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                  {selectedSpot.name}
                </h3>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full w-fit border border-red-200">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">
                    {selectedSpot.rating || "4.0"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {selectedSpot.description ||
                  "An incredible destination in Cebu waiting to be explored."}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Location
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedSpot.location || "Cebu, Philippines"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Category
                    </p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedSpot.category ||
                        selectedSpot.type ||
                        "Adventure Spot"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Distance
                    </p>
                    <p className="font-semibold text-gray-900">
                      {Math.round(selectedSpot.distance)}m from your location
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Price</p>
                    <p className="font-semibold text-green-600 text-lg">
                      {selectedSpot.price || "Free Entry"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSpot.activities &&
                selectedSpot.activities.length > 0 && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 font-medium mb-3">
                      Activities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpot.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedSpot(null);
                    navigate("/auth/login");
                  }}
                  className="flex items-center justify-center gap-4 flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  <Navigation2 />
                  Get Directions & Plan Visit
                </button>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="px-8 py-4 border-2 border-red-300 text-red-700 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300 font-semibold text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
