import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
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

const RoomModel = mongoose.model("Room", roomSchema);
export default RoomModel;
