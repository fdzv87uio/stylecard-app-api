import Session from "@/models/Session";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoose().catch((error) => res.json(error));
  const { token } = req.body;
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin!);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
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
