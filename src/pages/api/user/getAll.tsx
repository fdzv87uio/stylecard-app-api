import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import User from "@/models/User";

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
    console.log("Fetching User List");
    const filter = {};
    const response: any = await User.find(filter);
    const userList: any[] = response;
    return res.status(201).json({ status: "success", data: userList });
  } catch (error) {
    res.status(409).json({
      error: "An error occurred while creating user: " + error,
    });
  }
}
