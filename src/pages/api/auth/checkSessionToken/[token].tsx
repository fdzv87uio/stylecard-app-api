import Session from "@/models/Session";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  if (req.method !== "GET")
    res.status(409).json({ error: "Html Method not allowed" });
  if (!token) res.status(409).json({ error: " was not provided" });
  const existingSession = await Session.findOne({ token }).lean();
  if (!existingSession) {
    res.status(409).json({ error: "User Session Token not available" });
  } else {
    try {
      console.log("User Session Token Validated");
      const authUser = {
        email: existingSession.email,
        accessDatetime: existingSession.accessDatetime,
        token: existingSession.token,
      };
      return res.status(201).json({ status: "success", data: authUser });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while checking session token: " + error,
      });
    }
  }
}
