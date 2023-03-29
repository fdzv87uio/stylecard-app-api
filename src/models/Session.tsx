import { model, Schema, models } from "mongoose";

const sessionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  accessDatetime: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
});

const Session = models.Session || model("Session", sessionSchema);

export default Session;
