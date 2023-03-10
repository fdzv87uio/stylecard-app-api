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
  firstname: {
    type: String,
    minLength: [4, "Your firstname must be at least 4 characters long"],
    maxLength: [30, "Your firstname cannot have more than 30 characters"],
    default: "non available",
  },
  lastname: {
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
  stylePreferenceCode: {
    type: String,
    default: "non available",
  },
  wishlistCode: {
    type: String,
    default: "non available",
  },
  creationDate: {
    type: String,
    required: true,
  },
});

const User = models.User || model("User", userSchema);

export default User;
