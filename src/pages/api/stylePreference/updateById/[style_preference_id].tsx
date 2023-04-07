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
  const { names, values } = req.body;
  const { style_preference_id } = req.query;
  if (req.method !== "PUT")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Updating Style Preference");
    const mongoQuery = { _id: style_preference_id };
    let dataUpdate: any = {};
    names.forEach((item: any, key: number) => {
      dataUpdate[`${item}`] = values[key];
    });

    const options = { new: true };
    const response = await StylePreference.findOneAndUpdate(
      mongoQuery,
      dataUpdate,
      options
    );
    console.log("Style Preference");
    return res.status(200).json({ status: "success", data: response });
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while Style Preference: " + error.message,
    });
  }
}
