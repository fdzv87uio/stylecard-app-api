import { model, Schema, models } from "mongoose";

const wishlistSchema = new Schema({
  creator_id: {
    type: String,
    required: true,
    unique: true,
  },
  latest_update: {
    type: String,
  },
  creation_datetime: {
    type: String,
  },
  items: [
    {
      type: Schema.Types.Mixed,
      unique: true,
    },
  ],
});

const Wishlist = models.Wishlist || model("Wishlist", wishlistSchema);

export default Wishlist;
