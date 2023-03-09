import mongoose from "mongoose";

export async function connectMongoose() {
  try {
    console.log("connecting to MongoBD...");
    mongoose.connect(process.env.MONGO_DB_URI!);
    console.log("MongoDB connection established");
  } catch (error) {
    console.log("An error Ocurred while connecting to MongoBD: " + error);
  }
}
