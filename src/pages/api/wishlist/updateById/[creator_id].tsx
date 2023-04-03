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
  const { items } = req.body;
  const { creator_id } = req.query;
  if (req.method !== "PUT")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Updating Wishlist");
    const today = new Date();
    const mongoQuery = { creator_id: creator_id };
    let dataUpdate: any = {
      items: items,
      latest_update: today.toLocaleDateString(),
    };
    const options = { upsert: false };
    const response = await Wishlist.updateOne(mongoQuery, dataUpdate, options);
    if (response.acknowledged) {
      console.log("Wishlist Updated");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while updating wishlist",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while updating wishlist: " + error.message,
    });
  }
}
