import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    media: {
      images: [
        {
          url: String,
          caption: String,
          position: Number,
        },
      ],
      videos: [
        {
          url: String,
          thumbnail: String,
          duration: Number,
        },
      ],
    },
    location: {
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      address: String,
    },
    category: {
      type: String,
      enum: [
        "food",
        "adventure",
        "culture",
        "beach",
        "historical",
        "shopping",
        "other",
      ],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    engagement: {
      likes: {
        type: Number,
        default: 0,
      },
      likedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      shares: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
    },
    visibility: {
      type: String,
      enum: ["public", "private", "friends"],
      default: "public",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ "location.coordinates": "2dsphere" });
postSchema.index({ tags: 1 });

// Text search index
postSchema.index({
  content: "text",
  "location.name": "text",
  tags: "text",
});

const Post = mongoose.model("Post", postSchema, "post");

export default Post;
