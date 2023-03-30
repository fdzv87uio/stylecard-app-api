import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { compare, hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUrlSafeString } from "@/utils/formatters";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { password } = req.body;
  const { email } = req.query;
  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  if (!email) res.status(400).json({ error: "Email was not provided" });
  if (!password) res.status(400).json({ error: "Password was not provided" });
  const existingUser = await User.findOne({ email }).select("+password").lean();
  if (!existingUser) {
    res.status(403).json({ error: "Invalid Credentials" });
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
          user_id: existingUser._id,
        });
        return res.status(200).json({ status: "success", data: newToken });
      } else {
        res.status(400).json({
          error: "Passwords do not match",
        });
      }
    } catch (error: any) {
      res.status(409).json({
        error: error.message,
      });
    }
  }
}
