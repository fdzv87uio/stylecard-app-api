import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import StylePreference from "@/models/StylePreference";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { style_preference_id } = req.query;
  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Fetching Style Preference");
    const mongoQuery = { _id: style_preference_id };

    const response = await StylePreference.findOne(mongoQuery).lean();
    if (response.data.status === "success") {
      console.log("Style Preference Fetched...");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while fetching Style Preference",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: error.message,
    });
  }
}
