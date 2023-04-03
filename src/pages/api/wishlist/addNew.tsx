import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { newProductProps, newWishlistProps } from "@/types/types";
import Product from "@/models/Product";
import { runMiddleware } from "@/utils/corsUtil";
import Wishlist from "@/models/Wishlist";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { creator_id } = req.body;
  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (!creator_id)
    res.status(400).json({ error: "Bad Request: Data Fields Missing" });
  const query = { creator_id: creator_id };
  const existingWishlist = await Wishlist.findOne(query).lean();
  if (existingWishlist) {
    res.status(403).json({ error: "Wishlist already registered" });
  } else {
    try {
      console.log("Creating New Wishlist");
      const today = new Date();
      console.log(today.toLocaleDateString());
      const response = await Wishlist.create({
        creator_id: creator_id,
        creation_datetime: today.toLocaleDateString(),
        latest_update: today.toLocaleDateString(),
        items: [],
      });
      console.log("New Wishlist Created");
      const newWishlist: newWishlistProps = {
        _id: response._id,
        creator_id: response.creator_id,
        creation_datetime: response.creation_datetime,
        latest_update: response.latest_update,
        items: response.items,
      };
      return res.status(201).json({ status: "success", data: newWishlist });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating user: " + error,
      });
    }
  }
}
