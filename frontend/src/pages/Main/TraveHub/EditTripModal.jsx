import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Edit3,
  CheckCircle,
  PlayCircle,
  Flag,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react";

const EditTripModal = ({ trip, isOpen, onClose, onSave }) => {
  const [editedTrip, setEditedTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (trip) {
      setEditedTrip(JSON.parse(JSON.stringify(trip))); // Deep copy
    }
  }, [trip]);

  const statusOptions = [
    { value: "draft", label: "Draft", icon: Edit3, color: "bg-gray-500" },
    { value: "planned", label: "Planned", icon: CheckCircle, color: "bg-blue-500" },
    { value: "in-progress", label: "In Progress", icon: PlayCircle, color: "bg-yellow-500" },
    { value: "completed", label: "Completed", icon: Flag, color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", icon: X, color: "bg-red-500" },
  ];

  const visibilityOptions = [
    { value: "private", label: "Private", icon: EyeOff },
    { value: "shared", label: "Shared", icon: Share2 },
    { value: "public", label: "Public", icon: Eye },
  ];

  const categoryOptions = [
    "cultural", "adventure", "food", "beach", "shopping", 
    "historical", "nature", "nightlife", "family", "romantic", 
    "luxury", "budget"
  ];

  if (!isOpen || !editedTrip) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedTrip);
      onClose();
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip changes");
    } finally {
      setSaving(false);
    }
  };

  const handleTripChange = (field, value) => {
    setEditedTrip(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBudgetChange = (field, value) => {
    setEditedTrip(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value
      }
    }));
  };

  const handleTravelersChange = (type, value) => {
    setEditedTrip(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleInterestToggle = (interest) => {
    setEditedTrip(prev => {
      const currentInterests = prev.interests || [];
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest];
      
      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  const handleActivityToggle = (dayIndex, activityIndex) => {
    setEditedTrip(prev => {
      const newDays = [...prev.days];
      const activity = newDays[dayIndex].activities[activityIndex];
      activity.isCompleted = !activity.isCompleted;
      
      // Recalculate progress
      const totalActivities = newDays.reduce(
        (total, day) => total + day.activities.length,
        0
      );
      const completedActivities = newDays.reduce(
        (total, day) =>
          total + day.activities.filter(act => act.isCompleted).length,
        0
      );
      
      return {
        ...prev,
        days: newDays,
        progress: {
          plannedActivities: totalActivities,
          completedActivities: completedActivities,
          completionPercentage: Math.round((completedActivities / totalActivities) * 100)
        }
      };
    });
  };

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    setEditedTrip(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex].activities[activityIndex][field] = value;
      return { ...prev, days: newDays };
    });
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Title *
          </label>
          <input
            type="text"
            value={editedTrip.title}
            onChange={(e) => handleTripChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter trip title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={editedTrip.status}
            onChange={(e) => handleTripChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Days) *
          </label>
          <input
            type="number"
            value={editedTrip.duration?.days || 0}
            onChange={(e) => handleTripChange("duration", {
              ...editedTrip.duration,
              days: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Nights) *
          </label>
          <input
            type="number"
            value={editedTrip.duration?.nights || 0}
            onChange={(e) => handleTripChange("duration", {
              ...editedTrip.duration,
              nights: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>

      {/* Travelers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Travelers
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Adults</label>
            <input
              type="number"
              value={editedTrip.travelers?.adults || 1}
              onChange={(e) => handleTravelersChange("adults", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Children</label>
            <input
              type="number"
              value={editedTrip.travelers?.children || 0}
              onChange={(e) => handleTravelersChange("children", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Seniors</label>
            <input
              type="number"
              value={editedTrip.travelers?.seniors || 0}
              onChange={(e) => handleTravelersChange("seniors", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Budget
        </label>
        <input
          type="text"
          value={editedTrip.budget?.total || ""}
          onChange={(e) => handleBudgetChange("total", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="₱5,000"
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                editedTrip.interests?.includes(interest)
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <select
          value={editedTrip.visibility}
          onChange={(e) => handleTripChange("visibility", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {visibilityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const ActivitiesTab = () => (
    <div className="space-y-6">
      {editedTrip.days?.map((day, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Day {day.dayNumber}: {day.theme}
            </h3>
          </div>
          
          <div className="p-4 space-y-4">
            {day.activities.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className={`p-4 border rounded-lg transition-colors ${
                  activity.isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={activity.name}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, "name", e.target.value)}
                      className="w-full text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0 mb-1"
                    />
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <input
                          type="text"
                          value={activity.time}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, "time", e.target.value)}
                          className="bg-transparent border-none focus:ring-0 p-0 w-20"
                        />
                        <span>•</span>
                        <input
                          type="text"
                          value={activity.duration}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, "duration", e.target.value)}
                          className="bg-transparent border-none focus:ring-0 p-0 w-24"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <input
                          type="text"
                          value={activity.cost}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, "cost", e.target.value)}
                          className="bg-transparent border-none focus:ring-0 p-0 w-20"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleActivityToggle(dayIndex, activityIndex)}
                    className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      activity.isCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.isCompleted ? "Completed" : "Pending"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select
                      value={activity.category}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, "category", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                    >
                      <option value="cultural">Cultural</option>
                      <option value="adventure">Adventure</option>
                      <option value="food">Food</option>
                      <option value="beach">Beach</option>
                      <option value="historical">Historical</option>
                      <option value="nature">Nature</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={activity.location?.name || ""}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, "location", {
                        ...activity.location,
                        name: e.target.value
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                      placeholder="Location name"
                    />
                  </div>
                </div>

                {activity.description && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <textarea
                      value={activity.description}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, "description", e.target.value)}
                      rows="2"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {editedTrip.progress?.completionPercentage || 0}%
          </div>
          <div className="text-sm text-gray-600">
            {editedTrip.progress?.completedActivities || 0} of {editedTrip.progress?.plannedActivities || 0} activities completed
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-red-600 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${editedTrip.progress?.completionPercentage || 0}%`,
            }}
          />
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {editedTrip.duration?.days || 0}
          </div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
        
        <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {editedTrip.progress?.plannedActivities || 0}
          </div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        
        <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {editedTrip.progress?.completedActivities || 0}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {editedTrip.travelers ? 
              editedTrip.travelers.adults + (editedTrip.travelers.children || 0) + (editedTrip.travelers.seniors || 0) 
              : 1
            }
          </div>
          <div className="text-sm text-gray-600">Travelers</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Trip</h2>
            <p className="text-gray-600">Update your trip details and progress</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "activities", label: "Activities" },
              { id: "progress", label: "Progress" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "activities" && <ActivitiesTab />}
          {activeTab === "progress" && <ProgressTab />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;