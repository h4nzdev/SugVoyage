import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = `${Config.API_BASE_URL}/api`;

export class PostService {
  // Create a new post
  static async createPost(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create post",
      };
    }
  }

  // Get all posts
  static async getAllPosts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      return { success: false, posts: [] };
    }
  }

  // Get single post by ID
  static async getPostById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Post not found",
      };
    }
  }

  // Like a post
  static async likePost(postId, data) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        data
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to like post",
      };
    }
  }

  // Get posts by user
  static async getUserPosts(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      return { success: false, posts: [] };
    }
  }
}
