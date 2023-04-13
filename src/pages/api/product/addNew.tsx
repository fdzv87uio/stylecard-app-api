import User from "@/models/User";
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
  await connectMongoose().catch((error) => res.json(error));
  const {
    brand_name,
    product_name,
    gender,
    base_url,
    product_url,
    images,
    composition,
    id,
    fit,
    categories,
    sizes,
  } = req.body;

  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (
    !brand_name ||
    !product_name ||
    !gender ||
    !base_url ||
    !product_url ||
    !id ||
    !fit ||
    !categories ||
    !sizes 
  )
    res.status(400).json({ error: "Bad Request: Data Fields Missing" });
  const query = { product_name: product_name };
  const existingProduct = await Product.findOne(query).lean();
  if (existingProduct) {
    res.status(403).json({ error: "Product already registered" });
  } else {
    try {
      console.log("Creating New Product");
      const today = new Date();
      const compositionValue = composition ? composition : "n/a";
      const response = await Product.create({
        brand_name,
        product_name,
        gender,
        base_url,
        product_url,
        images,
        composition: compositionValue,
        product_id: id,
        fit,
        categories,
        sizes,
        date_pulled: today,
      });
      console.log("New Product Created");
      const newProduct: newProductProps = {
        _id: response._id,
        brand_name: response.brand_name,
        product_name: response.product_name,
        gender: response.gender,
        base_url: response.base_url,
        product_url: response.product_url,
        images: response.images,
        composition: response.composition,
        product_id: response.product_id,
        fit: response.fit,
        categories: response.categories,
        sizes: response.sizes,
        date_pulled: response.date_pulled,
      };
      return res.status(201).json({ status: "success", data: newProduct });
    } catch (error) {
      res.status(409).json({
        error: "An error occurred while creating user: " + error,
      });
    }
  }
}
