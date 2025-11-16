import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate likes
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

// Index for efficient queries
likeSchema.index({ targetType: 1, targetId: 1 });
likeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Like", likeSchema, "like");
