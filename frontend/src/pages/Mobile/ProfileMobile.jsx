import React from "react";
import {
  Edit3,
  MapPin,
  Calendar,
  Share2,
  MessageCircle,
  Heart,
  User,
  Bell,
  Shield,
  LogOut,
  ArrowLeft,
  Check,
} from "lucide-react";

const ProfileMobile = ({
  user,
  posts,
  savedItineraries,
  loading,
  isEditing,
  onEditProfile,
  onSaveProfile,
  onCloseEdit,
  onLogout,
}) => {
  const UserStats = () => {
    const userStats = [
      { label: "Posts", value: posts.length || "0", icon: MessageCircle },
      {
        label: "Followers",
        value: user?.socialStats?.followers || "0",
        icon: User,
      },
      {
        label: "Following",
        value: user?.socialStats?.following || "0",
        icon: User,
      },
      { label: "Spots", value: "32", icon: MapPin },
    ];

    return (
      <div className="bg-red-50 rounded-2xl p-4">
        <div className="text-gray-900 font-bold text-center mb-3">
          Community Contributions
        </div>
        <div className="flex justify-between">
          {userStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="items-center flex-1">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 mx-auto">
                  <IconComponent className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-lg font-black text-gray-900 text-center">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-xs text-center">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const UserPosts = () => {
    const formatTimeAgo = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    };

    if (loading) {
      return (
        <div className="bg-white px-5 py-5 mb-4">
          <div className="text-lg font-black text-gray-900 mb-4">
            My Community Posts
          </div>
          <div className="text-gray-500">Loading posts...</div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="bg-white px-5 py-5 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-lg font-black text-gray-900">
                My Community Posts
              </div>
              <div className="text-gray-500 text-sm">
                Shared experiences and feedback
              </div>
            </div>
            <button className="text-red-600 text-sm font-semibold">
              Create Post
            </button>
          </div>

          <div className="flex flex-col items-center py-8">
            <Edit3 className="w-10 h-10 text-gray-400 mb-3" />
            <div className="text-gray-500 text-center">
              No posts yet
              <div className="text-gray-400 text-sm mt-1">
                Share your first Cebu experience!
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white px-5 py-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-black text-gray-900">
              My Community Posts
            </div>
            <div className="text-gray-500 text-sm">
              Shared experiences and feedback
            </div>
          </div>
          <button className="text-red-600 text-sm font-semibold">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">📝</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 font-semibold text-sm mb-1">
                    {post.location?.name || "Cebu Location"}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {formatTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>

              <div className="text-gray-800 text-sm leading-5 mb-3">
                {post.content}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <div className="text-gray-500 text-sm ml-1">
                      {post.engagement?.likes || 0}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <div className="text-gray-500 text-sm ml-1">
                      {post.engagement?.comments || 0}
                    </div>
                  </div>
                </div>
                <button>
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SavedItineraries = () => (
    <div className="bg-white px-5 py-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-lg font-black text-gray-900">
            Saved Itineraries
          </div>
          <div className="text-gray-500 text-sm">AI-generated travel plans</div>
        </div>
        <button className="text-red-600 text-sm font-semibold">
          Create New
        </button>
      </div>

      <div className="space-y-3">
        {savedItineraries.map((itinerary) => (
          <div
            key={itinerary.id}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-gray-900 text-base">
                {itinerary.title}
              </div>
              <div className="bg-red-50 px-2 py-1 rounded-full">
                <div className="text-red-700 text-xs font-semibold">
                  {itinerary.duration}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 text-gray-500 mr-1" />
                <div className="text-gray-500 text-xs">
                  {itinerary.spots} spots
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 text-gray-500 mr-1" />
                <div className="text-gray-500 text-xs">{itinerary.created}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-red-600 py-2 rounded-xl">
                <div className="text-white text-center text-sm font-semibold">
                  View Plan
                </div>
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsSection = () => {
    const settingsOptions = [
      {
        icon: User,
        label: "Edit Profile",
        description: "Update your personal information",
        onPress: onEditProfile,
      },
      {
        icon: MapPin,
        label: "Radius Settings",
        description: "Adjust geofencing distance",
        onPress: () => console.log("Radius Settings"),
      },
      {
        icon: Bell,
        label: "Notifications",
        description: "Manage push alerts",
        onPress: () => console.log("Notifications"),
      },
      {
        icon: Shield,
        label: "Privacy",
        description: "Control data sharing",
        onPress: () => console.log("Privacy"),
      },
      {
        icon: LogOut,
        label: "Logout",
        description: "Sign out of your account",
        onPress: onLogout,
        color: "#DC143C",
      },
    ];

    return (
      <div className="bg-white px-5 py-5 mb-4">
        <div className="text-lg font-black text-gray-900 mb-4">
          Account Settings
        </div>

        <div className="space-y-2">
          {settingsOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <button
                key={index}
                onClick={option.onPress}
                className="flex items-center p-4 bg-gray-50 rounded-xl w-full text-left"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                    option.color ? "bg-red-100" : "bg-red-100"
                  }`}
                >
                  <IconComponent
                    className="w-5 h-5"
                    color={option.color || "#DC143C"}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold text-sm ${
                      option.color ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {option.description}
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-500 transform rotate-180" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const ProfileHeader = () => (
    <div className="bg-white px-5 py-6 mb-4">
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">{user.profile?.avatar || "👤"}</span>
          </div>
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="ml-4 flex-1">
          <div className="text-xl font-black text-gray-900">
            {user.profile?.displayName || user.username}
          </div>
          <div className="text-red-600 text-sm font-semibold mt-1">
            🗺️ {user.profile?.location || "Cebu Explorer"} • 📱 @{user.username}
          </div>

          {user.profile?.bio ? (
            <div className="text-gray-600 text-sm mt-2">{user.profile.bio}</div>
          ) : (
            <button onClick={onEditProfile} className="mt-2">
              <div className="text-gray-400 text-sm">Add a bio...</div>
            </button>
          )}

          <div className="flex items-center mt-2">
            <div className="bg-red-50 px-3 py-1 rounded-full">
              <div className="text-red-700 text-sm font-semibold">
                {user.isVerified
                  ? "Verified Explorer"
                  : "Community Contributor"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserStats />
    </div>
  );

  const EditProfileModal = () => {
    const [formData, setFormData] = React.useState({
      displayName: user.profile?.displayName || "",
      bio: user.profile?.bio || "",
      location: user.profile?.location || "",
      avatar: user.profile?.avatar || "👤",
    });

    if (!isEditing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold text-gray-900">Edit Profile</div>
            <button
              onClick={onCloseEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Where are you from?"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCloseEdit}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveProfile(formData)}
              disabled={loading}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black text-gray-900">My Profile</div>
          <button
            onClick={onEditProfile}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Edit3 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <ProfileHeader />
        <UserPosts />
        <SavedItineraries />
        <SettingsSection />

        {/* App Info */}
        <div className="flex flex-col items-center py-6">
          <div className="text-gray-500 text-sm">Sugoyage v1.0.0</div>
          <div className="text-gray-400 text-xs mt-1">
            The Smart Traveling Assistant for Cebu
          </div>
        </div>
      </div>

      <EditProfileModal />
    </div>
  );
};

export default ProfileMobile;
