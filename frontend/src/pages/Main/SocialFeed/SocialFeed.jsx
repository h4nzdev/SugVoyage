import React, { useState, useEffect, useContext } from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  Camera,
  Plus,
  Search,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import CommentModal from "../../../components/SocialFeed/CommentModal";
import { useComments } from "../../../hooks/useComments";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { useAuth } from "../../../hooks/useAuth";

const SocialFeed = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { posts, loading, error, likePost } = usePosts();
  const { getCommentCount } = useComments();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    const savedLikes = localStorage.getItem("likedPosts");
    if (savedLikes) {
      try {
        const likedPostIds = JSON.parse(savedLikes);
        setLikedPosts(new Set(likedPostIds));
      } catch (e) {
        console.error("[v0] Error parsing localStorage likes:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  useEffect(() => {
    if (posts.length > 0 && user?.id) {
      const liked = new Set();
      posts.forEach((post) => {
        if (post.engagement?.likedBy) {
          const isLiked = post.engagement.likedBy.some(
            (likedUserId) =>
              likedUserId.$oid === user.id || likedUserId === user.id
          );
          if (isLiked) {
            liked.add(post._id);
          }
        }
      });
      setLikedPosts(liked);
    }
  }, [posts, user?.id]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        const result = await getCommentCount(post._id);
        if (result.success) {
          counts[post._id] = result.count;
        } else {
          counts[post._id] = 0;
        }
      }
      setCommentCounts(counts);
    };

    if (posts.length > 0) {
      fetchCommentCounts();
    }
  }, [posts, getCommentCount]);

  const handleLike = async (postId) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    const result = await likePost(postId);
    if (!result.success) {
      // Revert on failure
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    }
  };

  const getAllUsers = () => {
    const usersMap = new Map();
    posts.forEach((post) => {
      if (post.author && !usersMap.has(post.author._id)) {
        usersMap.set(post.author._id, {
          id: post.author._id,
          name: post.author.profile?.displayName || "User",
          avatar: post.author.profile?.avatar || "U",
          location: post.author.profile?.location || "Cebu",
        });
      }
    });
    return Array.from(usersMap.values());
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
  };

  const closeCommentModal = () => {
    setSelectedPost(null);
  };

  const formatTimeAgo = (dateString) => {
    return "2 hours ago";
  };

  const getUserAvatar = (post) => {
    return post.author?.profile?.avatar || "U";
  };

  const getDisplayName = (post) => {
    return post.author?.profile?.displayName || "User";
  };

  const getPostCommentCount = (postId) => {
    return commentCounts[postId] || 0;
  };

  const isPostLikedByUser = (postId) => {
    return likedPosts.has(postId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center bg-white rounded-lg p-8 border border-red-200">
            <p className="text-red-600 font-semibold">Error loading posts</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const communityUsers = getAllUsers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Sugoyage
                </h1>
                <p className="text-red-600 font-medium text-sm mt-1">
                  Community
                </p>
              </div>
              <button
                onClick={() => navigate("/main/create-post")}
                className="bg-red-600 hover:bg-red-700 text-white p-2 md:p-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="Create new post"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 md:p-3 mb-6 overflow-x-auto">
            <div className="flex gap-2">
              {["all", "popular", "food"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeFilter === filter
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <Plus className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Share your Cebu adventure..."
                onClick={() => navigate("/main/create-post")}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                readOnly
              />
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors hidden md:block">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-4 md:p-5 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {getUserAvatar(post)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          onClick={() =>
                            navigate(`/main/profile/${post.author._id}`)
                          }
                          className="font-semibold text-gray-900 truncate hover:underline cursor-pointer"
                        >
                          {getDisplayName(post)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="flex-shrink-0" />
                            <span className="truncate">
                              {post.author?.profile?.location || "Cebu"}
                            </span>
                          </div>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {post.location?.name && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200">
                          <MapPin size={12} />
                          {post.location.name}
                        </span>
                      )}
                      {post.category && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                          <TrendingUp size={12} />
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <p className="text-gray-800 leading-relaxed text-base">
                      {post.content}
                    </p>

                    {post.media?.images?.length > 0 && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={post.media.images[0].url || "/placeholder.svg"}
                          alt="Post"
                          className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="px-4 md:px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">
                          {post.engagement?.views || 0}
                        </span>
                        views
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">
                          {(post.engagement?.likes || 0) +
                            (post.engagement?.shares || 0) +
                            getPostCommentCount(post._id)}
                        </span>
                        interactions
                      </span>
                    </div>
                  </div>

                  <div className="px-4 md:px-5 py-4 flex items-center justify-between gap-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                        isPostLikedByUser(post._id)
                          ? "bg-red-100 text-red-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isPostLikedByUser(post._id) ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm">
                        {post.engagement?.likes || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => openCommentModal(post)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">
                        {getPostCommentCount(post._id)}
                      </span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">
                        {post.engagement?.shares || 0}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  No posts found
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Be the first to share your story!
                </p>
                <button
                  onClick={() => navigate("/main/create-post")}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Create Post
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Community</h2>
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                {communityUsers.length}
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {communityUsers.length > 0 ? (
                communityUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/main/profile/${user.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.location}
                      </p>
                    </div>
                    <button className="flex-shrink-0 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-8">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPost && (
        <CommentModal
          post={selectedPost}
          onClose={closeCommentModal}
          onRefresh={() => {
            const fetchCount = async () => {
              const result = await getCommentCount(selectedPost._id);
              if (result.success) {
                setCommentCounts((prev) => ({
                  ...prev,
                  [selectedPost._id]: result.count,
                }));
              }
            };
            fetchCount();
          }}
        />
      )}
    </div>
  );
};

export default SocialFeed;
