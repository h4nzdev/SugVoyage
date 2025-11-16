// models/TripPlan.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  cost: {
    type: String,
    default: "Free",
  },
  description: String,
  category: {
    type: String,
    enum: [
      "cultural",
      "adventure",
      "food",
      "beach",
      "shopping",
      "relaxation",
      "historical",
      "nature",
      "transport",
    ],
    default: "cultural",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notes: String,
  transportToNext: {
    mode: String,
    duration: String,
    cost: String,
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: String,
  theme: String,
  activities: [activitySchema],
  totalCost: String,
  notes: String,
});

const tripPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      days: {
        type: Number,
        required: true,
      },
      nights: {
        type: Number,
        required: true,
      },
    },
    budget: {
      total: String,
      currency: {
        type: String,
        default: "₱",
      },
      perPerson: Boolean,
      breakdown: {
        accommodation: String,
        food: String,
        transportation: String,
        activities: String,
        miscellaneous: String,
      },
    },
    travelDates: {
      start: Date,
      end: Date,
    },
    travelers: {
      adults: {
        type: Number,
        default: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
      seniors: {
        type: Number,
        default: 0,
      },
    },
    interests: [
      {
        type: String,
        enum: [
          "cultural",
          "adventure",
          "food",
          "beach",
          "shopping",
          "historical",
          "nature",
          "nightlife",
          "family",
          "romantic",
          "luxury",
          "budget",
        ],
      },
    ],
    days: [daySchema],

    // Progress Tracking
    progress: {
      plannedActivities: {
        type: Number,
        default: 0,
      },
      completedActivities: {
        type: Number,
        default: 0,
      },
      completionPercentage: {
        type: Number,
        default: 0,
      },
    },

    // AI Generation Info
    generatedByAI: {
      type: Boolean,
      default: true,
    },
    aiPrompt: String,
    aiModel: String,

    // Status & Metadata
    status: {
      type: String,
      enum: ["draft", "planned", "in-progress", "completed", "cancelled"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["private", "shared", "public"],
      default: "private",
    },
    tags: [String],

    // Photos & Media
    coverImage: String,
    photos: [String],

    // Reviews & Ratings (after trip completion)
    userRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    userReview: String,

    // Sharing
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-calculate progress before save
tripPlanSchema.pre("save", function (next) {
  const totalActivities = this.days.reduce(
    (total, day) => total + day.activities.length,
    0
  );
  const completedActivities = this.days.reduce(
    (total, day) =>
      total + day.activities.filter((activity) => activity.isCompleted).length,
    0
  );

  this.progress.plannedActivities = totalActivities;
  this.progress.completedActivities = completedActivities;
  this.progress.completionPercentage =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  next();
});

// Index for efficient queries
tripPlanSchema.index({ user: 1, createdAt: -1 });
tripPlanSchema.index({ status: 1 });
tripPlanSchema.index({ "travelDates.start": 1 });
tripPlanSchema.index({ interests: 1 });

const TripPlan = mongoose.model("TripPlan", tripPlanSchema, "tripplan");

export default TripPlan;
