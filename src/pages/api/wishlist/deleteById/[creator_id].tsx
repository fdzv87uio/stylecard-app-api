import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import Wishlist from "@/models/Wishlist";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { creator_id } = req.query;
  if (req.method !== "DELETE")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Deleting Wishlist");
    const mongoQuery = { creator_id: creator_id };
    const response = await Wishlist.deleteOne(mongoQuery);
    if (response.deletedCount === 1) {
      console.log("Wishlist Deleted");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while deleting wishlist",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while deleting wishlist: " + error.message,
    });
  }
}
