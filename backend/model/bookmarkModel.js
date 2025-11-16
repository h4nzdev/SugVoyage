import mongoose from "mongoose";
const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    category: {
      type: String,
      enum: ["favorites", "want_to_visit", "visited", "food", "adventure"],
      default: "favorites",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

// Index for efficient queries
bookmarkSchema.index({ user: 1, category: 1 });
bookmarkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Bookmark", bookmarkSchema, "bookmark");
