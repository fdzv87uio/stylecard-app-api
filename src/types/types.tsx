export interface newProductProps {
  _id?: String;
  brand_name: String;
  product_name: String;
  gender: String;
  base_url: String;
  product_url: String;
  images: any;
  composition: String;
  product_id: any;
  fit: String;
  categories: String[];
  sizes: any;
  color_size_price?: any;
  color_size_images?: any;
  date_pulled: String;
}

export interface newStylePreferenceProps {
  _id: String;
  creator_id: String;
  product_category: any;
}

export interface newWishlistProps {
  _id?: String;
  creator_id: String;
  creation_datetime: String;
  latest_update: String;
  items: any[];
}
