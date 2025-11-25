import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: String },
  distance: { type: String },
  featured: { type: Boolean, default: false },
  geofence: { type: Boolean, default: false },
  color: { type: String },
  days: { type: String },
  description: { type: String },
  image_url: { type: String },
  activities: [String],
  source: { type: String },
  scraped_at: { type: Date },
  ml_validated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Spots = mongoose.model("tourist_spots", spotSchema);

export default Spots;
