import React, { useState } from "react";
import {
  Edit3,
  MapPin,
  Calendar,
  Share2,
  MessageCircle,
  Heart,
  User,
  Settings,
  Bookmark,
  Grid,
  Camera,
  Link,
  Check,
  TrendingUp,
  Globe,
  Tag,
  Eye,
  Award,
  Zap,
} from "lucide-react";

export default function ProfileDesktop({ user, posts, onEditProfile }) {
  const [activeTab, setActiveTab] = useState("posts");

  // Format time ago (e.g., "2 hours ago")
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

  // Get emoji for post category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      beach: "🏝️",
      mountain: "⛰️",
      heritage: "🏛️",
    };
    return emojiMap[category] || "📝";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div
        className="h-48 bg-gradient-to-r from-red-500 to-red-600 relative overflow-hidden"
        style={{
          backgroundImage: user.profile?.coverPhoto
            ? `url(${user.profile.coverPhoto})`
            : "linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(220, 38, 38) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Upload Cover Photo Button */}
        <button className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md">
          <Camera className="w-4 h-4" />
          Upload Cover
        </button>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header - Overlapping Cover */}
        <div className="-mt-20 relative z-10 mb-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Left Section - Avatar and Basic Info */}
              <div className="flex gap-6 flex-1">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-6xl">
                      {user.profile?.avatar || "👤"}
                    </span>
                  </div>
                  {user.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  {/* Name and Username */}
                  <div className="mb-3">
                    <h1 className="text-3xl font-bold text-gray-900 break-words">
                      {user.profile?.displayName}
                    </h1>
                    <p className="text-gray-600 text-base">@{user.username}</p>
                  </div>

                  {/* Bio */}
                  {user.profile?.bio && (
                    <p className="text-gray-700 text-base leading-6 mb-4 max-w-2xl">
                      {user.profile.bio}
                    </p>
                  )}

                  {/* Location and Links */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                    {user.profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {user.profile.location}
                      </div>
                    )}
                    <button className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors font-medium">
                      <Link className="w-4 h-4" />
                      Add Website
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex flex-col sm:flex-col gap-3 sm:w-auto">
                <button
                  onClick={onEditProfile}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {posts.length}
                </div>
                <div className="text-gray-600 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {user.socialStats?.followers || "0"}
                </div>
                <div className="text-gray-600 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {user.socialStats?.following || "0"}
                </div>
                <div className="text-gray-600 text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">42</div>
                <div className="text-gray-600 text-sm">Spots Visited</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "posts"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Posts
              </div>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "stats"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Stats
              </div>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-4 px-2 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Activity
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    My Community Posts
                  </h2>
                  <p className="text-gray-600">
                    Shared experiences and travel stories
                  </p>
                </div>

                {posts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Edit3 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No posts yet
                    </h3>
                    <p className="text-gray-500">
                      Share your first Cebu experience!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                      >
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                              {getCategoryEmoji(post.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {post.location?.name || "Cebu Location"}
                              </h3>
                              <p className="text-gray-500 text-sm">
                                {formatTimeAgo(post.createdAt)}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit3 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-800 text-base leading-6 mb-4">
                          {post.content}
                        </p>

                        {/* Post Engagement */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                              <Heart className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {post.engagement?.likes || 0}
                              </span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {post.engagement?.comments || 0}
                              </span>
                            </button>
                          </div>
                          <button className="text-gray-500 hover:text-red-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Community Stats
                  </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        {posts.length}
                      </div>
                      <div className="text-gray-600 text-sm">Total Posts</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        156
                      </div>
                      <div className="text-gray-600 text-sm">
                        Weekly Engagement
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        42
                      </div>
                      <div className="text-gray-600 text-sm">Spots Visited</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        +12%
                      </div>
                      <div className="text-gray-600 text-sm">Growth Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recent Activity
                  </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🏝️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-medium">
                          Shared a new post from Bantayan Island
                        </div>
                        <div className="text-gray-500 text-sm">2 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">💙</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-medium">
                          Liked a post about Kawasan Falls
                        </div>
                        <div className="text-gray-500 text-sm">1 day ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🗺️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 font-medium">
                          Saved 'South Cebu Adventure' itinerary
                        </div>
                        <div className="text-gray-500 text-sm">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Highlights */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">
                Profile Highlights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Member since</span>
                  </div>
                  <span className="font-semibold text-gray-900">2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Profile views</span>
                  </div>
                  <span className="font-semibold text-gray-900">1.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-sm">Top category</span>
                  </div>
                  <span className="font-semibold text-gray-900">Beaches</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-gray-700 text-sm mb-3 font-medium">
                    Achievements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-xs font-semibold">
                      🏆 Explorer
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-semibold">
                      📸 Photographer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
              <Award className="w-8 h-8 mb-3" />
              <h3 className="font-bold mb-2">Complete Your Profile</h3>
              <p className="text-sm text-red-100 mb-4">
                Add more details to increase engagement with other travelers
              </p>
              <button className="w-full bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors">
                Add Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
