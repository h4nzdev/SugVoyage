import { useState } from "react";
import { CommentService } from "../services/commentService";

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get comments for a post
  const getComments = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CommentService.getPostComments(postId);
      if (result.success) {
        setComments(result.comments || []);
        return result;
      } else {
        setError("Failed to load comments");
        setComments([]);
        return result;
      }
    } catch (err) {
      setError("Error fetching comments");
      setComments([]);
      return { success: false, message: "Error fetching comments" };
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId, commentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CommentService.addComment(postId, commentData);

      if (result.success) {
        // Add the new comment to the beginning of the list
        setComments((prev) => [result.comment, ...prev]);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      setError("Error adding comment");
      return { success: false, message: "Error adding comment" };
    } finally {
      setLoading(false);
    }
  };

  // Like a comment
  const likeComment = async (commentId) => {
    try {
      const result = await CommentService.likeComment(commentId);

      if (result.success) {
        // Update the comment in local state
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  engagement: {
                    ...comment.engagement,
                    likes: result.likes,
                  },
                }
              : comment
          )
        );
        return result;
      } else {
        setError("Failed to like comment");
        return result;
      }
    } catch (err) {
      setError("Error liking comment");
      return { success: false, message: "Error liking comment" };
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    try {
      const result = await CommentService.deleteComment(commentId);

      if (result.success) {
        // Remove the comment from local state
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        return result;
      } else {
        setError("Failed to delete comment");
        return result;
      }
    } catch (err) {
      setError("Error deleting comment");
      return { success: false, message: "Error deleting comment" };
    }
  };

  // Get single comment by ID
  const getCommentById = async (commentId) => {
    try {
      const result = await CommentService.getCommentById(commentId);
      return result;
    } catch (err) {
      return { success: false, message: "Error fetching comment" };
    }
  };

  const getCommentCount = async (postId) => {
    try {
      const result = await CommentService.getCommentCount(postId);
      return result;
    } catch (err) {
      return { success: false, count: 0 };
    }
  };

  // Clear comments
  const clearComments = () => {
    setComments([]);
    setError(null);
  };

  return {
    comments,
    loading,
    error,
    getComments,
    getCommentCount,
    addComment,
    likeComment,
    deleteComment,
    getCommentById,
    clearComments,
  };
};
