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
  if (req.method !== "DELETE")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Deleting Style Preference");
    const mongoQuery = { _id: style_preference_id };
    const response = await StylePreference.deleteOne(mongoQuery);
    if (response.deletedCount === 1) {
      console.log("Style Preference Deleted");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while Deleteing Style Preference",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while Deleteing Style Preference: " + error.message,
    });
  }
}
