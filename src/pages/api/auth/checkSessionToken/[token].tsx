import Session from "@/models/Session";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import { verify } from "jsonwebtoken";

const verifyToken = (token: any) => {
  try {
    let jwtSecret = process.env.JWT_SECRET!;
    const ver: any = verify(token, jwtSecret);

    if (ver.type === "user") {
      let result = { status: "success", data: ver };
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(JSON.stringify(error), "error");
    return false;
  }
};

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
  if (!token) {
    res.status(409).json({ error: " Token was not provided" });
  } else {
    try {
      console.log("Validating Token");
      const isTokenVerified: any = verifyToken(token);
      if (isTokenVerified.status === "success") {
        const userInfo = isTokenVerified.data;
        console.log("Token Validated");
        res.status(200).json({ status: "success", user_info: userInfo });
      }
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while checking session token: " + error,
      });
    }
  }
}
