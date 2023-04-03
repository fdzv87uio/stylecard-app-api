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
  const { data } = req.body;
  var resultCount = data.length;
  if (req.method !== "POST")
    res.status(405).json({ error: "Html Method not allowed" });
  if (!data) {
    res.status(400).json({ error: "Bad Request: Data Array Missing" });
  } else {
    data.forEach(async (item: any, key: number) => {
      if (
        !item.brand_name ||
        !item.product_name ||
        !item.gender ||
        !item.base_url ||
        !item.product_url ||
        !item.id ||
        !item.fit ||
        !item.categories ||
        !item.sizes ||
        !item.color_size_price ||
        !item.color_size_images
      ) {
        res.status(400).json({
          error: `Bad Request: item no. ${key + 1} has missing data fields`,
        });
      } else {
        const query = { product_name: item.product_name };
        const existingProduct = await Product.findOne(query).lean();
        if (existingProduct) {
          res.status(400).json({
            error: `Bad Request: item no. ${key + 1} is already registered: `,
          });
        } else {
          const today = new Date();
          const colorArray = Object.keys(item.color_size_images);
          const CSIKeys = Object.keys(item.color_size_images);
          const firstElement = CSIKeys[0];
          const defaultImage = item.color_size_images[firstElement].all[0];
          const imagesArray = item.images ? item.images : [defaultImage];
          const compositionValue = item.composition ? item.composition : "n/a";
          try {
            const response = await Product.create({
              brand_name: item.brand_name,
              product_name: item.product_name,
              gender: item.gender,
              base_url: item.base_url,
              product_url: item.product_url,
              images: imagesArray,
              colors: colorArray,
              composition: compositionValue,
              product_id: item.id,
              fit: item.fit,
              categories: item.categories,
              sizes: item.sizes,
              color_size_price: item.color_size_price,
              color_size_images: item.color_size_images,
              date_pulled: today,
            });
            console.log("New Product Created");
            res.status(200).json({ status: "success", data: response });
          } catch (error: any) {
            res.status(200).json({ error: error.message });
          }
        }
      }
    });
  }
}