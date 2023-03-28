import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id } = req.query;
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  if (req.method !== "DELETE")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Deleting User");
    const mongoQuery = { _id: user_id };
    const response = await User.deleteOne(mongoQuery);
    if (response.deletedCount === 1) {
      console.log("User Deleted");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while updating product",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while updating product: " + error.message,
    });
  }
}
