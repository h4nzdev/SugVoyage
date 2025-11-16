import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Mongo connection failed", error);
    process.exit(1);
  }
};

export default connectB;
