import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      avatar: {
        type: String,
        default: "👤",
      },
      bio: {
        type: String,
        maxlength: 500,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      coverPhoto: {
        type: String,
        default: "",
      },
    },
    socialStats: {
      followers: {
        type: Number,
        default: 0,
      },
      following: {
        type: Number,
        default: 0,
      },
      postsCount: {
        type: Number,
        default: 0,
      },
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
userSchema.index({
  "profile.displayName": "text",
  username: "text",
  "profile.bio": "text",
});

const User = mongoose.model("User", userSchema, "user");
export default User;
