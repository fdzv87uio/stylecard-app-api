import { Schema, models, model } from "mongoose";

const stylePreferenceSchema = new Schema({
  creator_id: {
    type: String,
    required: true,
  },
  product_category: [
    {
      type: String,
    },
  ],
  creation_date: {
    type: String,
    required: true,
  },
  last_update: {
    type: String,
    required: true,
  },
  dress_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  jacket_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  jacket_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  jacket_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  parka_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  parka_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  parka_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  gilet_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  gilet_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  gilet_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  coat_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  coat_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  coat_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  vest_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  vest_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  vest_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  sweater_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  sweater_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  sweater_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shirt_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shirt_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shirt_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  t_shirt_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  t_shirt_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  t_shirt_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  bra_chest: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  bra_hip: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  bra_waist: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
});

const StylePreference =
  models.StylePreference || model("StylePreference", stylePreferenceSchema);

export default StylePreference;
