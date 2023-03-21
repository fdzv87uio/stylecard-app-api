import User from "@/models/User";
import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { newProductProps } from "@/types/types";
import Product from "@/models/Product";

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
  await connectMongoose().catch((error: any) => res.json(error.message));

  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Fetching Product List");
    const filter = {};
    const response: any = await Product.find(filter);
    const productList: newProductProps[] = response;
    return res.status(201).json({ status: "success", data: productList });
  } catch (error) {
    res.status(409).json({
      error: "An error occurred while creating user: " + error,
    });
  }
}
