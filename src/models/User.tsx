import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "A valid email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  first_name: {
    type: String,
    minLength: [4, "Your firstname must be at least 4 characters long"],
    maxLength: [30, "Your firstname cannot have more than 30 characters"],
    default: "non available",
  },
  last_name: {
    type: String,
    minLength: [4, "Your lastname must be at least 4 characters long"],
    maxLength: [30, "Your lastname cannot have more than 30 characters"],
    default: "non available",
  },
  phone: {
    type: String,
    minLength: [10, "Your phone number must contain at least 10 digits"],
    default: "non available",
  },
  birthday: {
    type: String,
    default: "non available",
  },
  style_preference_code: {
    type: String,
    default: "non available",
  },
  wishlist_code: {
    type: String,
    default: "non available",
  },
  creation_date: {
    type: String,
    required: true,
  },
  height: { type: Number, default: 0 },
  chest: { type: Number, default: 0 },
  waist: { type: Number, default: 0 },
  hips: { type: Number, default: 0 },
  neck: { type: Number, default: 0 },
  arm_length: { type: Number, default: 0 },
  shoulder: { type: Number, default: 0 },
  upper_leg_circumference: { type: Number, default: 0 },
  leg_length: { type: Number, default: 0 },
  ankle_circumference: { type: Number, default: 0 },
  wrist_circumference: { type: Number, default: 0 },
  shoulder_to_elbow: { type: Number, default: 0 },
  elbow_to_wrist: { type: Number, default: 0 },
  ankle_to_knee: { type: Number, default: 0 },
  knee_to_hip: { type: Number, default: 0 },
  lower_leg_circumference: { type: Number, default: 0 },
  upper_arm_circumference: { type: Number, default: 0 },
  lower_arm_circumference: { type: Number, default: 0 },
  torso_length: { type: Number, default: 0 },
  inseam: { type: Number, default: 0 },
  outseam: { type: Number, default: 0 },
  bust: { type: Number, default: 0 },
  shoulder_to_waist: { type: Number, default: 0 },
  underbust_to_hip: { type: Number, default: 0 },
  shoulder_to_hem: { type: Number, default: 0 },
  rise: { type: Number, default: 0 },
  waist_to_butt: { type: Number, default: 0 },
  hem_circumference: { type: Number, default: 0 },
  shoulder_to_crotch: { type: Number, default: 0 },
  form_completed: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model("User", userSchema);

export default User;
