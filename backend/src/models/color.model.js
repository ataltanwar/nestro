import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      match: [/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Please provide a valid hex color"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ColorModel = mongoose.model("Color", colorSchema);
export default ColorModel;
