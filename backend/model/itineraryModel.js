import mongoose from "mongoose";

// Schema Definition
const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    duration: {
      days: Number,
      nights: Number,
    },
    budget: {
      type: String,
      enum: ["budget", "moderate", "luxury"],
    },
    interests: [String],
    activities: [
      {
        day: Number,
        order: Number,
        location: {
          name: String,
          coordinates: {
            latitude: Number,
            longitude: Number,
          },
        },
        activity: String,
        duration: Number, // in minutes
        cost: Number,
        notes: String,
        transportation: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    saves: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
itinerarySchema.index({ user: 1, createdAt: -1 });
itinerarySchema.index({ isPublic: 1, likes: -1 });
itinerarySchema.index({ "activities.location.coordinates": "2dsphere" });

// Virtual for total cost calculation
itinerarySchema.virtual("totalCost").get(function () {
  return this.activities.reduce(
    (total, activity) => total + (activity.cost || 0),
    0
  );
});

// Instance method to add activity
itinerarySchema.methods.addActivity = function (activityData) {
  this.activities.push(activityData);
  return this.save();
};

// Static method to find popular itineraries
itinerarySchema.statics.findPopular = function (limit = 10) {
  return this.find({ isPublic: true })
    .sort({ likes: -1 })
    .limit(limit)
    .populate("user", "profile.displayName profile.avatar");
};

// Pre-save middleware to update order if needed
itinerarySchema.pre("save", function (next) {
  // Ensure activities are properly ordered by day and order
  this.activities.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.order - b.order;
  });
  next();
});

// Create and export the Model
const Itinerary = mongoose.model("Itinerary", itinerarySchema, "itinerary");

export default Itinerary;
