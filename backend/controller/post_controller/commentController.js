import Comment from "../../model/Post_Model/commentModel.js";
import Post from "../../model/Post_Model/postModel.js";

export const CommentController = {
  // Add comment to a post
  async addComment(req, res) {
    try {
      const { postId } = req.params;
      const { author, content, parentComment } = req.body;

      // Validation
      if (!author || !content) {
        return res.status(400).json({
          success: false,
          message: "Author and content are required",
        });
      }

      // Check if post exists and is active
      const post = await Post.findById(postId);
      if (!post || !post.isActive) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // If this is a reply, check if parent comment exists
      if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (!parent || !parent.isActive) {
          return res.status(404).json({
            success: false,
            message: "Parent comment not found",
          });
        }
      }

      const comment = new Comment({
        post: postId,
        author,
        content,
        parentComment: parentComment || null,
      });

      const savedComment = await comment.save();

      // Update engagement counts
      if (parentComment) {
        // If it's a reply, increment parent comment's replies count
        await Comment.findByIdAndUpdate(parentComment, {
          $inc: { "engagement.replies": 1 },
        });
      }

      // Populate author info for response
      await savedComment.populate(
        "author",
        "username profile.displayName profile.avatar"
      );

      res.status(201).json({
        success: true,
        message: parentComment
          ? "Reply added successfully"
          : "Comment added successfully",
        comment: savedComment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding comment",
        error: error.message,
      });
    }
  },

  // Get comments for a post (with optional replies)
  async getPostComments(req, res) {
    try {
      const { postId } = req.params;
      const {
        page = 1,
        limit = 20,
        sort = "newest",
        includeReplies = false,
      } = req.query;

      // Check if post exists
      const post = await Post.findById(postId);
      if (!post || !post.isActive) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Sort options
      const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        popular: { "engagement.likes": -1 },
      };

      // Base query - only top-level comments
      const baseQuery = {
        post: postId,
        parentComment: null,
        isActive: true,
      };

      const comments = await Comment.find(baseQuery)
        .populate("author", "username profile.displayName profile.avatar")
        .sort(sortOptions[sort] || sortOptions.newest)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // If including replies, populate them for each comment
      if (includeReplies === "true") {
        for (let comment of comments) {
          const replies = await Comment.find({
            parentComment: comment._id,
            isActive: true,
          })
            .populate("author", "username profile.displayName profile.avatar")
            .sort({ createdAt: 1 })
            .limit(10); // Limit replies per comment

          comment.replies = replies;
        }
      }

      // Get total count for pagination
      const totalComments = await Comment.countDocuments(baseQuery);

      res.json({
        success: true,
        comments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(totalComments / limit),
          total: totalComments,
          hasMore: totalComments > page * limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching comments",
        error: error.message,
      });
    }
  },

  // Get replies for a specific comment
  async getCommentReplies(req, res) {
    try {
      const { commentId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const comment = await Comment.findById(commentId);
      if (!comment || !comment.isActive) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      const replies = await Comment.find({
        parentComment: commentId,
        isActive: true,
      })
        .populate("author", "username profile.displayName profile.avatar")
        .sort({ createdAt: 1 }) // Oldest first for replies (conversation flow)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalReplies = await Comment.countDocuments({
        parentComment: commentId,
        isActive: true,
      });

      res.json({
        success: true,
        replies,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(totalReplies / limit),
          total: totalReplies,
          hasMore: totalReplies > page * limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching comment replies",
        error: error.message,
      });
    }
  },

  // Update a comment
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Content is required and cannot be empty",
        });
      }

      const comment = await Comment.findById(commentId);

      if (!comment || !comment.isActive) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      // Add authorization check here if needed
      // if (comment.author.toString() !== req.user.id) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Not authorized to update this comment",
      //   });
      // }

      comment.content = content.trim();
      comment.isEdited = true;
      comment.editedAt = new Date();

      const updatedComment = await comment.save();
      await updatedComment.populate(
        "author",
        "username profile.displayName profile.avatar"
      );

      res.json({
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating comment",
        error: error.message,
      });
    }
  },

  // Delete a comment (soft delete)
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      // Add authorization check here if needed
      // if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Not authorized to delete this comment",
      //   });
      // }

      // Soft delete
      comment.isActive = false;
      await comment.save();

      // Update engagement counts
      if (comment.parentComment) {
        // If it's a reply, decrement parent comment's replies count
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $inc: { "engagement.replies": -1 },
        });
      } else {
        // If it's a top-level comment, decrement post's comment count
        await Post.findByIdAndUpdate(comment.post, {
          $inc: { "engagement.comments": -1 },
        });
      }

      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting comment",
        error: error.message,
      });
    }
  },

  // Like a comment
  async likeComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment || !comment.isActive) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      comment.engagement.likes += 1;
      await comment.save();

      res.json({
        success: true,
        message: "Comment liked",
        likes: comment.engagement.likes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error liking comment",
        error: error.message,
      });
    }
  },

  // Unlike a comment
  async unlikeComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment || !comment.isActive) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      if (comment.engagement.likes > 0) {
        comment.engagement.likes -= 1;
        await comment.save();
      }

      res.json({
        success: true,
        message: "Comment unliked",
        likes: comment.engagement.likes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error unliking comment",
        error: error.message,
      });
    }
  },

  // Get comment by ID with full details
  async getCommentById(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId)
        .populate("author", "username profile.displayName profile.avatar")
        .populate("post", "content location.name");

      if (!comment || !comment.isActive) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      res.json({
        success: true,
        comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching comment",
        error: error.message,
      });
    }
  },

  // Get comment statistics for a post
  async getCommentStats(req, res) {
    try {
      const { postId } = req.params;

      const stats = await Comment.aggregate([
        {
          $match: {
            post: new mongoose.Types.ObjectId(postId),
            isActive: true,
          },
        },
        {
          $group: {
            _id: "$parentComment",
            totalComments: { $sum: 1 },
            totalLikes: { $sum: "$engagement.likes" },
            totalReplies: { $sum: "$engagement.replies" },
          },
        },
      ]);

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching comment statistics",
        error: error.message,
      });
    }
  },
  // In your CommentController
  async getCommentCount(req, res) {
    try {
      const { postId } = req.params;

      const commentCount = await Comment.countDocuments({
        post: postId,
        isActive: true,
        parentComment: null, // Only count top-level comments if you want
      });

      res.json({
        success: true,
        count: commentCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching comment count",
        error: error.message,
      });
    }
  },
};
