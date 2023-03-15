import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { hash } from "bcryptjs";
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
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    res.status(409).json({ error: "Email is already registered" });
  } else {
    try {
      console.log("creating user...");

      const today = new Date();
      const salt = parseInt(process.env.ENCRYPTION_SALT!);
      const hashedPass = await hash(password, salt);
      const test = await User.create({
        email: email,
        password: hashedPass,
        creationDate: today,
      });
      console.log("New user Created");
      const token = `stylecard-session-token: ${email}, ${today}`;
      const tokenHash = await hash(token, salt);
      const safeTokenHash = getUrlSafeString(tokenHash);
      console.log("Creating Session Token");
      const newToken = await Session.create({
        email: email,
        accessDatetime: today,
        token: safeTokenHash,
      });
      const newUser = {
        email: test.email,
        _id: test._id,
        token: newToken.token,
      };
      return res.status(201).json({ status: "success", data: newUser });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating user: " + error,
      });
    }
  }
}
