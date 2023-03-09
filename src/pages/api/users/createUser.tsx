// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongoose();
    console.log("Adding new User");
    const test = await User.create(req.body);
    console.log("User Created Successfully");
    res.status(200).send({ status: 200 });
  } catch (error) {
    res.status(400).send({ status: 400 });
    console.log("An error occured while creating new User: " + error);
  }
}
