// hooks/usePosts.js
import { useState, useEffect, useContext } from "react";
import { PostService } from "../services/postService";
import { AuthenticationContext } from "../context/AuthenticationContext";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthenticationContext);

  // Get all posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await PostService.getAllPosts();
      if (result.success) {
        setPosts(result.posts || []);
      } else {
        setError("Failed to load posts");
        setPosts([]);
      }
    } catch (err) {
      setError("Error fetching posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Like a post
  const likePost = async (postId) => {
    try {
      const userId = user.id;
      const result = await PostService.likePost(postId, { userId });

      if (result.success) {
        // Update the post in local state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    likes: result.likes,
                    likedBy: result.isLiked
                      ? [...(post.engagement?.likedBy || []), userId]
                      : post.engagement?.likedBy?.filter(
                          (id) => id !== userId
                        ) || [],
                  },
                }
              : post
          )
        );
        return result;
      } else {
        setError("Failed to like post");
        return result;
      }
    } catch (err) {
      setError("Error liking post");
      return { success: false, message: "Error liking post" };
    }
  };

  // Create a new post
  const createPost = async (formData) => {
    setLoading(true);
    try {
      const result = await PostService.createPost(formData);
      if (result.success) {
        // Add the new post to the beginning of the list
        setPosts((prevPosts) => [result.post, ...prevPosts]);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      setError("Error creating post");
      return { success: false, message: "Error creating post" };
    } finally {
      setLoading(false);
    }
  };

  // Get posts by user
  const fetchUserPosts = async (userId) => {
    setLoading(true);
    try {
      const result = await PostService.getUserPosts(userId);
      if (result.success) {
        setPosts(result.posts || []);
        return result;
      } else {
        setError("Failed to load user posts");
        setPosts([]);
        return result;
      }
    } catch (err) {
      setError("Error fetching user posts");
      setPosts([]);
      return { success: false, message: "Error fetching user posts" };
    } finally {
      setLoading(false);
    }
  };

  // Get single post by ID
  const getPostById = async (postId) => {
    try {
      const result = await PostService.getPostById(postId);
      return result;
    } catch (err) {
      return { success: false, message: "Error fetching post" };
    }
  };

  // Load posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    likePost,
    createPost,
    fetchUserPosts,
    getPostById,
  };
};
