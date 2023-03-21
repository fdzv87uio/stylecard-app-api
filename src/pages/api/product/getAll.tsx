import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { newProductProps } from "@/types/types";
import Product from "@/models/Product";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
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
