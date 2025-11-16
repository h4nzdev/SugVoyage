import React, { useState } from "react";
import { TripPlanService } from "../../../services/tripPlanService";

const CreateTripModal = ({ isOpen, onClose }) => {
  const [tripData, setTripData] = useState({
    title: "",
    duration: {
      days: 1,
      nights: 0,
    },
    budget: {
      total: "",
      currency: "₱",
      perPerson: false,
      breakdown: {
        accommodation: "",
        food: "",
        transportation: "",
        activities: "",
        miscellaneous: "",
      },
    },
    travelDates: {
      start: "",
      end: "",
    },
    travelers: {
      adults: 1,
      children: 0,
      seniors: 0,
    },
    interests: [],
    days: [],
    status: "draft",
    visibility: "private",
    tags: [],
    generatedByAI: false,
    aiPrompt: "",
    aiModel: "",
  });

  const interestOptions = [
    "cultural",
    "adventure",
    "food",
    "beach",
    "shopping",
    "historical",
    "nature",
    "nightlife",
    "family",
    "romantic",
    "luxury",
    "budget",
  ];

  const handleInputChange = (path, value) => {
    setTripData((prev) => {
      const keys = path.split(".");
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleInterestToggle = (interest) => {
    setTripData((prev) => {
      const updatedInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];

      return { ...prev, interests: updatedInterests };
    });
  };

  const handleTagAdd = (tag) => {
    if (tag && !tripData.tags.includes(tag)) {
      setTripData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTripData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCreateTrip = async () => {
    const completeTripData = {
      ...tripData,
      progress: {
        plannedActivities: 0,
        completedActivities: 0,
        completionPercentage: 0,
      },
      photos: [],
      sharedWith: [],
      userRating: null,
      userReview: "",
    };

    const response = await TripPlanService.saveTripPlan(completeTripData);

    // Reset form
    setTripData({
      title: "",
      duration: { days: 1, nights: 0 },
      budget: {
        total: "",
        currency: "₱",
        perPerson: false,
        breakdown: {
          accommodation: "",
          food: "",
          transportation: "",
          activities: "",
          miscellaneous: "",
        },
      },
      travelDates: { start: "", end: "" },
      travelers: { adults: 1, children: 0, seniors: 0 },
      interests: [],
      days: [],
      status: "draft",
      visibility: "private",
      tags: [],
      generatedByAI: false,
      aiPrompt: "",
      aiModel: "",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-500 text-white p-6 rounded-t-lg sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Create New Trip</h2>
              <p className="text-red-100 mt-1">Plan your perfect adventure</p>
            </div>
            <button
              onClick={onClose}
              className="text-red-100 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Title *
              </label>
              <input
                type="text"
                value={tripData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Cebu City & Heritage Hop"
              />
            </div>

            {/* Travel Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={tripData.travelDates.start}
                onChange={(e) =>
                  handleInputChange("travelDates.start", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={tripData.travelDates.end}
                onChange={(e) =>
                  handleInputChange("travelDates.end", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days *
              </label>
              <input
                type="number"
                min="1"
                value={tripData.duration.days}
                onChange={(e) =>
                  handleInputChange(
                    "duration.days",
                    parseInt(e.target.value) || 1
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nights *
              </label>
              <input
                type="number"
                min="0"
                value={tripData.duration.nights}
                onChange={(e) =>
                  handleInputChange(
                    "duration.nights",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Budget Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Budget Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget *
                </label>
                <input
                  type="text"
                  value={tripData.budget.total}
                  onChange={(e) =>
                    handleInputChange("budget.total", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., ₱3,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={tripData.budget.currency}
                  onChange={(e) =>
                    handleInputChange("budget.currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="₱">₱ PHP</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tripData.budget.perPerson}
                  onChange={(e) =>
                    handleInputChange("budget.perPerson", e.target.checked)
                  }
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Budget is per person
                </span>
              </label>
            </div>

            {/* Budget Breakdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Budget Breakdown (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={tripData.budget.breakdown.accommodation}
                    onChange={(e) =>
                      handleInputChange(
                        "budget.breakdown.accommodation",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="₱1,000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Food
                  </label>
                  <input
                    type="text"
                    value={tripData.budget.breakdown.food}
                    onChange={(e) =>
                      handleInputChange("budget.breakdown.food", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="₱800"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Transportation
                  </label>
                  <input
                    type="text"
                    value={tripData.budget.breakdown.transportation}
                    onChange={(e) =>
                      handleInputChange(
                        "budget.breakdown.transportation",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="₱500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Activities
                  </label>
                  <input
                    type="text"
                    value={tripData.budget.breakdown.activities}
                    onChange={(e) =>
                      handleInputChange(
                        "budget.breakdown.activities",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="₱400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Miscellaneous
                  </label>
                  <input
                    type="text"
                    value={tripData.budget.breakdown.miscellaneous}
                    onChange={(e) =>
                      handleInputChange(
                        "budget.breakdown.miscellaneous",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="₱300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Travelers
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Adults
                </label>
                <input
                  type="number"
                  min="1"
                  value={tripData.travelers.adults}
                  onChange={(e) =>
                    handleInputChange(
                      "travelers.adults",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Children
                </label>
                <input
                  type="number"
                  min="0"
                  value={tripData.travelers.children}
                  onChange={(e) =>
                    handleInputChange(
                      "travelers.children",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Seniors
                </label>
                <input
                  type="number"
                  min="0"
                  value={tripData.travelers.seniors}
                  onChange={(e) =>
                    handleInputChange(
                      "travelers.seniors",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interests
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tripData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tripData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 hover:text-red-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleTagAdd(e.target.value.trim());
                  e.target.value = "";
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* AI Generation */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Generation
            </h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tripData.generatedByAI}
                  onChange={(e) =>
                    handleInputChange("generatedByAI", e.target.checked)
                  }
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This trip was generated by AI
                </span>
              </label>

              {tripData.generatedByAI && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Prompt
                    </label>
                    <textarea
                      value={tripData.aiPrompt}
                      onChange={(e) =>
                        handleInputChange("aiPrompt", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Describe what you want for your trip..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Model
                    </label>
                    <input
                      type="text"
                      value={tripData.aiModel}
                      onChange={(e) =>
                        handleInputChange("aiModel", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., gemini-2.0-flash"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={tripData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={tripData.visibility}
                onChange={(e) =>
                  handleInputChange("visibility", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTrip}
            disabled={!tripData.title || !tripData.budget.total}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
