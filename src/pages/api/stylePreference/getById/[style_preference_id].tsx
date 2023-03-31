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
    const result = await StylePreference.findOne({
      _id: style_preference_id,
    });
    console.log(result);
    console.log("Style Preference Fetched...");
    return res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(409).json({
      error: error.message,
    });
  }
}
