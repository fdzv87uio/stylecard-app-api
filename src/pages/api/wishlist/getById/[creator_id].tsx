import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import User from "@/models/User";
import Wishlist from "@/models/Wishlist";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error: any) => res.json(error.message));
  const { creator_id } = req.query;
  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Fetching Wishlist");
    const filter = { creator_id: creator_id };
    const response: any = await Wishlist.find(filter);
    const userList: any[] = response;
    console.log("Wishlist Fetched");
    return res.status(200).json({ status: "success", data: userList });
  } catch (error) {
    res.status(409).json({
      error: "An error occurred while fetching wishlist: " + error,
    });
  }
}
