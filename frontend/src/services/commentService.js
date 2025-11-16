import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class CommentService {
  // Add comment to a post
  static async addComment(postId, commentData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/comments/posts/${postId}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to add comment",
      };
    }
  }

  // Get comments for a post
  static async getPostComments(postId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/posts/${postId}/comments`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch comments",
        comments: [],
      };
    }
  }

  // Get comment by ID
  static async getCommentById(commentId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Comment not found",
      };
    }
  }

  // Like a comment
  static async likeComment(commentId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/comments/comments/${commentId}/like`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to like comment",
      };
    }
  }

  // Delete a comment
  static async deleteComment(commentId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/comments/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete comment",
      };
    }
  }

  static async getCommentCount(postId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/posts/${postId}/comments/count`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        count: 0,
      };
    }
  }
}
