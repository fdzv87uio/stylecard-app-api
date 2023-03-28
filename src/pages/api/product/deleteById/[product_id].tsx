import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import Product from "@/models/Product";
import { runMiddleware } from "@/utils/corsUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error) => res.json(error));
  const { product_id } = req.query;
  if (req.method !== "DELETE")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Deleting Product");
    const mongoQuery = { _id: product_id };
    const response = await Product.deleteOne(mongoQuery);
    if (response.deletedCount === 1) {
      console.log("Product Deleted");
      return res.status(201).json({ status: "success", data: response });
    } else {
      res.status(409).json({
        error: "An error occurred while updating product",
      });
    }
  } catch (error: any) {
    res.status(409).json({
      error: "An error occurred while updating product: " + error.message,
    });
  }
}
