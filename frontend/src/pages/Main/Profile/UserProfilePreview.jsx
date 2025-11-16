import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Camera,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  Globe,
  Mail,
} from "lucide-react";
import { PostService } from "../../../services/postService";
import { AuthenticationService } from "../../../services/authenticationService";

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const colors = {
    primary: "#DC143C",
    primaryLight: "#FEE2E2",
  };

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user profile
      const profileResult = await AuthenticationService.getUserProfile(userId);

      if (profileResult.success) {
        setUser(profileResult.user);

        // Fetch user's posts
        const postsResult = await PostService.getUserPosts(userId);
        if (postsResult.success) {
          setPosts(postsResult.posts || []);
        }
      } else {
        setError(profileResult.message || "Failed to load profile");
      }
    } catch (err) {
      setError("Error loading profile");
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const PostCard = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const hasMedia = post.media?.images && post.media.images.length > 0;

    return (
      <div className="bg-white border border-gray-200 mb-6">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              {user?.profile?.avatar?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">
                  {user?.profile?.displayName || user?.username}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={10} />
                <span>{post.location?.name || "Cebu"}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>

        {/* Location Tag */}
        {post.location?.name && (
          <div className="px-4 pb-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
              style={{
                backgroundColor: colors.primaryLight,
                color: colors.primary,
              }}
            >
              📍 {post.location.name}
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="px-4 pb-4">
          <p className="text-gray-800 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Media */}
        {hasMedia && (
          <div className="border-y border-gray-200">
            {post.media.images.length === 1 ? (
              <div className="w-full">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image"}
                  className="w-full max-h-96 object-contain bg-gray-50"
                />
              </div>
            ) : post.media.images.length === 2 ? (
              <div className="flex h-80">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image 1"}
                  className="w-1/2 h-full object-cover border-r border-gray-200"
                />
                <img
                  src={post.media.images[1].url}
                  alt={post.media.images[1].caption || "Post image 2"}
                  className="w-1/2 h-full object-cover"
                />
              </div>
            ) : post.media.images.length >= 3 ? (
              <div className="grid grid-cols-2 gap-1 h-80">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image 1"}
                  className="col-span-2 h-40 object-cover"
                />
                <img
                  src={post.media.images[1].url}
                  alt={post.media.images[1].caption || "Post image 2"}
                  className="h-40 object-cover"
                />
                <div className="relative h-40">
                  <img
                    src={post.media.images[2].url}
                    alt={post.media.images[2].caption || "Post image 3"}
                    className="w-full h-full object-cover"
                  />
                  {post.media.images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{post.media.images.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{post.engagement?.views || 0} views</span>
            <span>
              {(post.engagement?.comments || 0) +
                (post.engagement?.shares || 0)}{" "}
              interactions
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-600 text-red-600" : "text-gray-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isLiked ? "text-red-600" : "text-gray-600"
                }`}
              >
                {post.engagement?.likes || 0}
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.engagement?.comments || 0}
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.engagement?.shares || 0}
              </span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? "fill-gray-900 text-gray-900" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto px-6">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {user.profile?.displayName || user.username}
              </h1>
              <p className="text-sm text-gray-500">{posts.length} posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex md:flex-row flex-col md:items-start items-center md:gap-6 gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                {user.profile?.avatar?.[0]?.toUpperCase() || "U"}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col md:items-start items-center flex-1">
              <div className="flex gap-3 md:mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.profile?.displayName || user.username}
                </h2>
                {user.isVerified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 md:mb-4">@{user.username}</p>

              {user.profile?.bio && (
                <p className="text-gray-700 md:mb-4 mb-2 leading-relaxed">
                  {user.profile.bio}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                {user.profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{user.profile.location}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{posts.length}</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {user.socialStats?.followers || 0}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {user.socialStats?.following || 0}
                  </div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex gap-2">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Follow
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle size={18} />
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === "posts"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === "about"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto py-6">
        {activeTab === "posts" && (
          <div>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500">
                  {user.profile?.displayName || user.username} hasn't shared any
                  posts yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>

            <div className="space-y-4">
              {user.profile?.bio && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
                  <p className="text-gray-600">{user.profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.profile?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {user.profile.location}
                      </p>
                    </div>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
