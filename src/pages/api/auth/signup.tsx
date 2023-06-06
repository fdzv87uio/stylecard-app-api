import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { email, password } = req.body;
  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (!email)
    res.status(400).json({ error: "Bad request: Data fields Missing" });
  if (!password)
    res.status(400).json({ error: "Bad request: Data fields Missing" });
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    res.status(403).json({ error: "Email is already registered" });
  } else {
    try {
      console.log("creating user...");
      const today = new Date();
      const salt = parseInt(process.env.ENCRYPTION_SALT!);
      const hashedPass = await hash(password, salt);
      const newUser = await User.create({
        email: email,
        password: hashedPass,
        creation_date: today,
      });
      console.log("New user Created");
      return res.status(201).json({ status: "success" });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating user: " + error,
      });
    }
  }
}
