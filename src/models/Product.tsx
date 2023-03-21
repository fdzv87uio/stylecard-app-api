import { model, Schema, models } from "mongoose";

const productSchema = new Schema({
  brand_name: { type: String, required: true },
  product_name: { type: String, required: true },
  gender: { type: String, required: true },
  base_url: { type: String, required: true },
  product_url: { type: String, required: true },
  images: [{ type: String }],
  composition: { type: String, required: true },
  product_id: {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  fit: { type: String, required: true },
  categories: [{ type: String }],
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
  color_price_size: [
    {
      color_name: { type: String },
      XS: { type: String },
      S: { type: String },
      M: { type: String },
      L: { type: String },
      XL: { type: String },
      XXL: { type: String },
    },
  ],
  color_size_image: [
    {
      color_name: { type: String },
      XS: [{ type: String }],
      S: [{ type: String }],
      M: [{ type: String }],
      L: [{ type: String }],
      XL: [{ type: String }],
      XXL: [{ type: String }],
    },
  ],
  date_pulled: { type: String, required: true },
});

const Product = models.Product || model("Product", productSchema);

export default Product;
