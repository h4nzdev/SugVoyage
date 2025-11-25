import React, { useContext, useState } from "react";
import {
  Camera,
  MapPin,
  Tag,
  Globe,
  Lock,
  X,
  Plus,
  Coffee,
  Mountain,
  Home,
  Sun,
  Book,
  ShoppingBag,
  Star,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../../hooks/usePosts";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const { createPost } = usePosts();

  const [formData, setFormData] = useState({
    content: "",
    location: {
      name: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    category: "other",
    tags: [],
    visibility: "public",
    rating: 0,
  });
  const [currentTag, setCurrentTag] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const colors = {
    primary: "#DC143C",
    primaryLight: "#FEE2E2",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  const categories = [
    { id: "food", label: "Food", icon: Coffee },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "culture", label: "Culture", icon: Home },
    { id: "beach", label: "Beach", icon: Sun },
    { id: "historical", label: "Historical", icon: Book },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "other", label: "Other", icon: Star },
  ];

  const popularLocations = [
    "Kawasan Falls, Badian",
    "Temple of Leah, Cebu City",
    "Magellan's Cross, Cebu City",
    "Fort San Pedro, Cebu City",
    "Sirao Flower Garden, Cebu City",
    "Tops Lookout, Cebu City",
    "Bantayan Island",
    "Malapascua Island",
    "Moalboal",
    "Oslob Whale Shark Watching",
    "CNT Lechon, Mandaue",
    "Larsian BBQ, Cebu City",
    "Sutukil, Mactan",
  ];

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    if (field === "locationName") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          name: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !formData.tags.includes(currentTag.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const selectLocation = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        name: location,
      },
    }));
  };

  // Star Rating Handler
  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  // Map Picker Handler
  const handleMapPick = () => {
    // For demo purposes, we'll simulate picking a location
    const demoLocations = [
      "10.3157, 123.8854 - Cebu City Central",
      "10.2927, 123.9014 - Ayala Center Cebu",
      "10.3119, 123.9183 - SM City Cebu",
      "10.2970, 123.8915 - Carbon Market",
    ];

    const randomLocation =
      demoLocations[Math.floor(Math.random() * demoLocations.length)];

    setFormData((prev) => ({
      ...prev,
      location: {
        name: randomLocation,
        coordinates: {
          latitude: parseFloat(randomLocation.split(" - ")[0].split(", ")[0]),
          longitude: parseFloat(randomLocation.split(" - ")[0].split(", ")[1]),
        },
      },
    }));

    setShowMapPicker(false);
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      alert("Please write something about your experience!");
      return;
    }

    if (!formData.location.name.trim()) {
      alert("Please add a location!");
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();

    // Append post data as individual fields (not JSON)
    formDataToSend.append("author", user.id);
    formDataToSend.append("content", formData.content.trim());
    formDataToSend.append("location[name]", formData.location.name.trim());
    formDataToSend.append("category", formData.category);
    formDataToSend.append("visibility", formData.visibility);
    formDataToSend.append("rating", formData.rating.toString());

    // Append tags as individual fields
    formData.tags.forEach((tag) => {
      formDataToSend.append("tags[]", tag);
    });

    // Append images if any
    selectedImages.forEach((image, index) => {
      formDataToSend.append("images", image.file);
    });

    // Use the hook to create post
    const result = await createPost(formDataToSend);

    if (result.success) {
      alert("Post created successfully!");
      // Clean up preview URLs
      selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
      navigate(-1);
    } else {
      alert(`Failed: ${result.message}`);
    }
  };

  const characterCount = formData.content.length;
  const maxCharacters = 2000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-lg">👤</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Your Name</h3>
                  <p className="text-gray-500 text-sm">
                    Sharing a Cebu experience
                  </p>
                </div>
              </div>

              {selectedImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Image Preview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Input */}
              <div className="mb-6">
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="What's amazing about this place? Share your experience..."
                  className="w-full min-h-48 p-4 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                  maxLength={maxCharacters}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2 text-gray-400">
                    {/* Image Upload Button */}
                    <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <ImageIcon className="w-5 h-5" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <span
                    className={`text-sm ${
                      characterCount > maxCharacters * 0.9
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
                {selectedImages.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedImages.length} image(s) selected - will be uploaded
                    when you click "Post"
                  </p>
                )}
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  Your Rating
                </h3>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600 font-medium">
                    {formData.rating > 0
                      ? `${formData.rating}.0 stars`
                      : "No rating"}
                  </span>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleInputChange("category", category.id)
                        }
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.category === category.id
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <IconComponent
                            className={`w-5 h-5 ${
                              formData.category === category.id
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs mt-1 font-medium ${
                              formData.category === category.id
                                ? "text-red-700"
                                : "text-gray-600"
                            }`}
                          >
                            {category.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Input */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </h3>

                {/* Selected Location Display */}
                {formData.location.name && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Selected Location:
                    </p>
                    <p className="text-green-700">{formData.location.name}</p>
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.location.name}
                    onChange={(e) =>
                      handleInputChange("locationName", e.target.value)
                    }
                    placeholder="Where did you go? (e.g., Kawasan Falls, Badian)"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                  <button
                    onClick={() => setShowMapPicker(true)}
                    className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Map className="w-5 h-5" />
                    <span className="hidden sm:inline">Pick on Map</span>
                  </button>
                </div>

                {/* Quick Location Suggestions */}
                <div className="mt-3">
                  <p className="text-gray-500 text-sm mb-2">Popular in Cebu:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocation(location)}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
                      >
                        <span className="text-gray-700 text-sm">
                          {location}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags Input */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </h3>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags (e.g., beach, sunset, food)"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Tags List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded-full flex items-center space-x-2"
                      >
                        <span className="text-sm font-medium">#{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Visibility Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Visibility</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleInputChange("visibility", "public")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.visibility === "public"
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Public</p>
                          <p className="text-gray-500 text-sm">
                            Anyone can see your post
                          </p>
                        </div>
                      </div>
                      {formData.visibility === "public" && (
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleInputChange("visibility", "private")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.visibility === "private"
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Private</p>
                          <p className="text-gray-500 text-sm">
                            Only you can see this post
                          </p>
                        </div>
                      </div>
                      {formData.visibility === "private" && (
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Post Guidelines */}
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Posting Guidelines
                </h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    Be respectful and kind to others
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    Share authentic experiences
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    Include accurate location information
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    Use relevant categories and tags
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    No spam or promotional content
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Post Summary
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span className="font-medium">{characterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-medium">
                      {formData.rating > 0
                        ? `${formData.rating}.0 stars`
                        : "Not rated"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tags:</span>
                    <span className="font-medium">{formData.tags.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">
                      {formData.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <span className="font-medium capitalize">
                      {formData.visibility}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Map className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Pick Location on Map</h2>
                    <p className="text-red-100">Select your exact location</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMapPicker(false)}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Simple Map Placeholder */}
              <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-600">
                  <Map className="w-12 h-12 mx-auto mb-2" />
                  <p>Map Picker Interface</p>
                  <p className="text-sm">(For demo purposes)</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Demo:</strong> Click the button below to simulate
                  picking a random Cebu location.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleMapPick}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-all"
                >
                  Pick This Location
                </button>
                <button
                  onClick={() => setShowMapPicker(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
