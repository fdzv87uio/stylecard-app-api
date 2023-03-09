import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  birthday: { type: Date, required: false },
  clothingType: { type: String },
  bodyMeasurements: {
    measureUnit: { type: String, required: false },
    waist: { type: Number, required: false },
    hips: { type: Number, required: false },
    chest: { type: Number, required: false },
    height: { type: Number, required: false },
  },
  stylePreferences: [
    {
      garmentName: { type: String },
      options: [
        {
          bodySection: { type: String },
          preference: { type: String },
        },
      ],
    },
  ],
});

const User = models.User || model("User", userSchema);

export default User;
