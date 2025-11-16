// components/SocialFeed/CommentModal.jsx
import React, { useState, useContext, useEffect } from "react";
import { Send, X, Heart } from "lucide-react";
import { useComments } from "../../hooks/useComments";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const colors = {
  primary: "#DC143C",
  primaryLight: "#FEE2E2",
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const CommentModal = ({ post, onClose, onRefresh }) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useContext(AuthenticationContext);
  const { comments, loading, error, getComments, addComment, likeComment } =
    useComments();

  // Fetch comments when modal opens
  useEffect(() => {
    if (post?._id) {
      getComments(post._id);
    }
  }, [post?._id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const result = await addComment(post._id, {
      content: commentText,
      author: user.id,
    });

    if (result.success) {
      setCommentText("");
      if (onRefresh) onRefresh();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const CommentItem = ({ comment }) => (
    <div className="flex gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: colors.primary }}
      >
        {comment.author?.profile?.avatar ||
          comment.author?.username?.charAt(0).toUpperCase() ||
          "U"}
      </div>

      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
          <div className="font-semibold text-sm">
            {comment.author?.profile?.displayName ||
              comment.author?.username ||
              "Anonymous"}
          </div>
          <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-1 px-2">
          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
          <button
            onClick={() => likeComment(comment._id)}
            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
          >
            <Heart
              size={12}
              className={
                comment.engagement?.likes > 0 ? "fill-red-600 text-red-600" : ""
              }
            />
            {comment.engagement?.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            // Loading state
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-2xl h-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            // Comments list
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No comments yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center py-2">{error}</div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                user ? "Write a comment..." : "Please login to comment"
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!user || loading}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim() || !user || loading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                commentText.trim() && user && !loading
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
