import mongoose, { model, Schema, models } from "mongoose";

const productSchema = new Schema({
  brand_name: { type: String, required: true },
  product_name: { type: String, required: true, unique: true },
  description: { type: String },
  gender: { type: String, required: true },
  deep_url: { type: String, required: true },
  product_url: { type: String, required: true },
  images: [{ type: String, required: true }],
  color: { type: String, required: true },
  product_id: {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  category: { type: String, required: true },
  size: { type: Schema.Types.Mixed },
  price: { type: String, required: true },
  date_pulled: { type: String, required: true },
});

const Product = models.Product || model("Product", productSchema);

export default Product;
