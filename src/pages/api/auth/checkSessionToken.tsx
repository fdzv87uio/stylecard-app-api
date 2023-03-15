import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoose().catch((error) => res.json(error));
  const { token } = req.body;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
