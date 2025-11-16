import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      placeId: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    categories: [
      {
        type: String,
        enum: [
          "food",
          "service",
          "atmosphere",
          "value",
          "cleanliness",
          "accessibility",
        ],
      },
    ],
    media: [
      {
        type: String, // URLs to images/videos
        caption: String,
      },
    ],
    helpful: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate ratings for same location by same user
ratingSchema.index({ user: 1, "location.name": 1 }, { unique: true });

// Index for location-based queries
ratingSchema.index({ "location.coordinates": "2dsphere" });
ratingSchema.index({ "location.name": 1, rating: -1 });
ratingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Rating", ratingSchema, "rating");
