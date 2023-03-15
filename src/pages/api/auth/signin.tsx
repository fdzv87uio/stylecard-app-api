import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { compare, hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { getUrlSafeString } from "@/utils/formatters";

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
  // Run the middleware
  await runMiddleware(req, res, cors);
  await connectMongoose().catch((error) => res.json(error));
  const { email, password } = req.body;
  if (req.method !== "POST")
    res.status(409).json({ error: "Html Method not allowed" });
  if (!email) res.status(409).json({ error: "Email was not provided" });
  if (!password) res.status(409).json({ error: "Password was not provided" });
  const existingUser = await User.findOne({ email }).select("+password").lean();
  if (!existingUser) {
    res.status(409).json({ error: "Invalid Credentials" });
  } else {
    try {
      console.log("validating user...");
      const passwordMatch = await compare(password, existingUser.password);
      if (passwordMatch) {
        const today = new Date();
        const salt = parseInt(process.env.ENCRYPTION_SALT!);
        const token = `stylecard-session-token: ${email}, ${today}`;
        const tokenHash = await hash(token, salt);
        const safeTokenHash = getUrlSafeString(tokenHash);
        console.log("Creating Session Token");
        const newToken = await Session.create({
          email: email,
          accessDatetime: today,
          token: safeTokenHash,
        });
        return res.status(201).json({ status: "success", data: newToken });
      } else {
        res.status(409).json({
          error: "Passwords do not match",
        });
      }
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating user: " + error,
      });
    }
  }
}
