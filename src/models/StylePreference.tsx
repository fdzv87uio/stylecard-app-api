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
  ss_shirt_chest_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_waist_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_hips_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_shoulder_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_sleeve_length_shoulder_to_hem: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_sleeve_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_shirt_neck_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ss_neck_type: {
    type: String,
    default: "n/a",
  },
  ss_shirt_type: {
    type: String,
    default: "n/a",
  },
  ls_shirt_chest_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_waist_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_hips_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_shoulder_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_sleeve_length_shoulder_to_hem: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_sleeve_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_neck_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_neck_cut: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  ls_shirt_type: {
    type: String,
    default: "n/a",
  },
  shorts_waist_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_length_outseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_hem_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_hips_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_upper_leg_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  shorts_type: {
    type: String,
    default: "n/a",
  },
  pants_waist_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_length_inseamshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_length_outseamshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_riseshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_ankle_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_hips_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_upper_leg_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_lower_leg_circumferenceshorts_length_inseam: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  pants_type: {
    type: String,
    default: "n/a",
  },
  dress_waist_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_hips_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_chest_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_sleeve_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_torso_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_front_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_back_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_hem_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_upper_leg_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_lower_leg_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_neck_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_shoulder_to_hem_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  dress_type: {
    type: String,
    default: "n/a",
  },
  skirt_waist_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_hips_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_hem_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_length: {
    type: String,
    default: "n/a",
  },
  skirt_front_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_back_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_slit_length: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_upper_leg_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_lower_leg_circumference: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  skirt_type: {
    type: String,
    default: "n/a",
  },
  sex: {
    type: String,
    default: "both",
  },
});

const StylePreference =
  models.StylePreference || model("StylePreference", stylePreferenceSchema);

export default StylePreference;
