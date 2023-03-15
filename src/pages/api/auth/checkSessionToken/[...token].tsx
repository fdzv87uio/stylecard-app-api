import Session from "@/models/Session";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;
  // Run the middleware
  await runMiddleware(req, res, cors);
  await connectMongoose().catch((error) => res.json(error));
  if (req.method !== "GET")
    res.status(409).json({ error: "Html Method not allowed" });
  if (!token) res.status(409).json({ error: " was not provided" });
  const existingSession = await Session.findOne({ token });
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
