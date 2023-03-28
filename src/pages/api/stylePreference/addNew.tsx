import StylePreference from "@/models/StylePreference";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { newStylePreferenceProps } from "@/types/types";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { creator_id, product_category } = req.body;

  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (!product_category)
    res.status(400).json({ error: "Bad Request: Data Fields Missing" });
  const query = { creator_id: creator_id };
  const existingProduct = await StylePreference.findOne(query).lean();
  if (existingProduct) {
    res.status(403).json({ error: "Style Preference already registered" });
  } else {
    try {
      console.log("Creating New Style Preference");
      const today = new Date();
      const response = await StylePreference.create({
        creator_id,
        product_category,
        creation_date: today,
        last_update: today,
      });
      console.log("New Style Preference Created");
      const newStylePreference: newStylePreferenceProps = {
        _id: response._id,
        creator_id,
        product_category,
      };
      return res
        .status(201)
        .json({ status: "success", data: newStylePreference });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating style preference: " + error,
      });
    }
  }
}
