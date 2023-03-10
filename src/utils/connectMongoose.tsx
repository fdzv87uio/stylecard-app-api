import mongoose from "mongoose";

export async function connectMongoose() {
  let url = process.env.MONGODB_URI;
  if (!url) {
    throw new Error("Invalid MongoBD Connection Url");
  }
  try {
    const { connection } = await mongoose.connect(url);
    if (connection.readyState === 1) {
      console.log("MongoDB Connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
