import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { compare, hash } from "bcryptjs";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoose().catch((error) => res.json(error));
  const { email, password } = req.body;
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin!);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.method !== "POST")
    res.status(409).json({ error: "Html Method not allowed" });
  if (!email) res.status(409).json({ error: "Email was not provided" });
  if (!password) res.status(409).json({ error: "Password was not provided" });
  const existingUser = await User.findOne({ email }).select("+password");
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
        console.log("Creating Session Token");
        const newToken = await Session.create({
          email: email,
          accessDatetime: today,
          token: tokenHash,
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
