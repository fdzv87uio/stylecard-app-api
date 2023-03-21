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
  await connectMongoose().catch((error) => res.json(error));
  const {
    brand_name,
    product_name,
    gender,
    base_url,
    product_url,
    images,
    composition,
    product_id,
    fit,
    category,
    sizes,
    color_size_price,
    color_size_image,
  } = req.body;

  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (
    !brand_name ||
    !product_name ||
    !gender ||
    !base_url ||
    !product_url ||
    !images ||
    !composition ||
    !product_id ||
    !fit ||
    !category ||
    !sizes ||
    !color_size_price ||
    !color_size_image
  )
    res.status(400).json({ error: "Bad Request: Data Fields Missing" });
    const query = { product_name: product_name };
  const existingProduct = await User.findOne(query).lean();
  if (existingProduct) {
    res.status(403).json({ error: "Product already registered" });
  } else {
    try {
      console.log("Creating New Product");
      const today = new Date();
      const response = await Product.create({
        brand_name,
        product_name,
        gender,
        base_url,
        product_url,
        images,
        composition,
        product_id,
        fit,
        category,
        sizes,
        color_size_price,
        color_size_image,
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
        category: response.category,
        sizes: response.sizes,
        color_size_price: response.color_size_price,
        color_size_image: response.color_size_image,
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
