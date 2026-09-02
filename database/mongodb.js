import mongoose from "mongoose";
import { DATABASE_URL, NODE_ENV } from "../config/env.js";

if (!DATABASE_URL) {
  throw new Error("MongoDB connection requires DATABASE_URL");
}

const connectableBase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log(`MongoDB connection connected in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

export default connectableBase;
