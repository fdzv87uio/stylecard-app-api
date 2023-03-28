import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error: any) => res.json(error.message));

  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Fetching products from Data Bridge ");
    return res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(409).json({
      error: "An error occurred while Fetching products from Data Bridge: " + error,
    });
  }
}
