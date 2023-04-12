import { model, Schema, models } from "mongoose";

const productSchema = new Schema({
  brand_name: { type: String, required: true },
  product_name: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  base_url: { type: String, required: true },
  product_url: { type: String, required: true },
  images: [{ type: String }],
  colors: [{ type: String }],
  merchant_price: { type: String, required: true },
  composition: { type: String },
  product_id: {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  fit: { type: String, required: true },
  categories: [{ type: String, required: true }],
  sizes: [
    {
      size_name: { type: String },
      size_unit: { type: String },
      chest_min: { type: Number },
      chest_max: { type: Number },
      waist_min: { type: Number },
      waist_max: { type: Number },
      hip_min: { type: Number },
      hip_max: { type: Number },
      sleeve_length_min: { type: Number },
      sleeve_length_max: { type: Number },
      body_length_min: { type: Number },
      body_length_max: { type: Number },
    },
  ],
  color_size_price: { type: String },
  color_size_images: { type: String },
  date_pulled: { type: String, required: true },
});

const Product = models.Product || model("Product", productSchema);

export default Product;
