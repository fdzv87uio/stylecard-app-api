import mongoose from "mongoose";

let cachedConnection: any = null; // Create cached connection variable

export async function connectMongoose() {
  const uri = process.env.MONGODB_URI!;
  if (cachedConnection) {
    console.log("using cached DB connection");
    return cachedConnection; // Prefer cached connection
  }
  // if not cached
  const client = await mongoose.connect(uri);
  console.log("using new DB connection");
  cachedConnection = client; // Cache the database connection
  return client;
}
