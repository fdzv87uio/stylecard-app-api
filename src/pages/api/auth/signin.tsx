import Session from "@/models/Session";
import { serialize } from "cookie";
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import { compare, hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUrlSafeString } from "@/utils/formatters";
import { runMiddleware } from "@/utils/corsUtil";
import { sign } from "jsonwebtoken";

// user login function
const createUserJWT = async (id: string, email: string) => {
  try {
    let jwtSecret = process.env.JWT_SECRET!;
    let token = sign({ id: id, username: email, type: "user" }, jwtSecret, {
      expiresIn: "2h",
    });
    return { status: "ok", data: token };
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
};

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
        const token = await createUserJWT(existingUser._id, existingUser.email);
        if (token.status === "ok") {
          const tokenString = token.data!;
          res.status(500).json({ status: "success", token: tokenString });
        }
      } else {
        res.status(400).json({
          error: "The Passwords do not match",
        });
      }
    } catch (error: any) {
      res.status(409).json({
        error: error.message,
      });
    }
  }
}
