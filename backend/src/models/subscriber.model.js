import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    name: {
      type: String,
      trim: true,
      default: "",
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  }
);

const SubscriberModel = mongoose.model("Subscriber", subscriberSchema);
export default SubscriberModel;
