import React, { useState, useEffect, useRef } from "react";

const EditProfileModal = ({
  visible,
  onClose,
  user,
  onSaveProfile,
  loading,
}) => {
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    location: "",
    avatar: "👤",
  });

  // Use refs for inputs to prevent re-renders
  const displayNameRef = useRef(null);
  const bioRef = useRef(null);
  const locationRef = useRef(null);

  // Initialize edit data when modal opens
  useEffect(() => {
    if (user && visible) {
      setEditData({
        displayName: user.profile?.displayName || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        avatar: user.profile?.avatar || "👤",
      });
    }
  }, [user, visible]);

  // Reset refs when modal closes
  useEffect(() => {
    if (!visible) {
      // Clear any pending focus
      displayNameRef.current?.blur();
      bioRef.current?.blur();
      locationRef.current?.blur();
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSaveProfile(editData);
    console.log(editData);
  };

  // Handle overlay click to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && visible) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 text-base hover:text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`text-base font-semibold ${
              loading ? "text-gray-400" : "text-red-600 hover:text-red-700"
            } disabled:opacity-50`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">{editData.avatar}</span>
              </div>
              <button className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
                <span className="text-white text-sm font-semibold">
                  Change Avatar
                </span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Display Name
                </label>
                <input
                  ref={displayNameRef}
                  value={editData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your display name"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Bio
                </label>
                <textarea
                  ref={bioRef}
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base h-20 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Location
                </label>
                <input
                  ref={locationRef}
                  value={editData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Where are you from?"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Email
                </label>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <span className="text-gray-500">{user?.email}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Username
                </label>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <span className="text-gray-500">{user?.username}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Username cannot be changed
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Account Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Member since</span>
                  <span className="text-gray-900 text-sm">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Last active</span>
                  <span className="text-gray-900 text-sm">
                    {user?.lastActive
                      ? new Date(user.lastActive).toLocaleDateString()
                      : "Now"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span className="text-green-600 text-sm font-semibold">
                    {user?.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
