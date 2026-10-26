import RoomModel from "../models/room.model.js";
import ProductModel from "../models/product.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
} from "../utils/response.js";

const normalizeCount = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new Error("Room count must be a valid non-negative number");
  }

  return parsedValue;
};

const normalizeStatus = (status, fallback = true) => {
  if (status === undefined) {
    return fallback;
  }

  return status === "true" || status === true;
};

const handleRoomError = (res, error) => {
  if (error?.message === "Room count must be a valid non-negative number") {
    return sendBadRequest(res, error.message);
  }

  if (error?.code === 11000) {
    return sendConflict(res, "Room already exists. Please use a different name or slug.");
  }

  if (error?.name === "ValidationError") {
    const messages = Object.values(error.errors || {}).map((item) => item.message);
    return sendBadRequest(res, messages[0] || "Invalid room data");
  }

  return sendServerError(res, error);
};

export const create = async (req, res) => {
  try {
    const { name, slug, count, image, status } = req.body;

    if (!name || !slug) {
      return sendBadRequest(res, "Name and slug are required");
    }

    let uploadedImageUrl = image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/rooms");
      uploadedImageUrl = result.secure_url;
    }

    const existingRoom = await RoomModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingRoom) {
      return sendConflict(
        res,
        `Room already exists with name "${existingRoom.name}" or slug "${existingRoom.slug}"`
      );
    }

    const room = await RoomModel.create({
      name,
      slug,
      count: normalizeCount(count),
      image: uploadedImageUrl,
      status: normalizeStatus(status),
    });

    return res.status(201).json({
      success: true,
      message: `Room "${room.name}" created successfully`,
      room,
    });
  } catch (error) {
    return handleRoomError(res, error);
  }
};

export const read = async (req, res) => {
  try {
    const rooms = await RoomModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Room data found",
      rooms,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readOne = async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);

    if (!room) {
      return sendNotFound(res, "Room not found");
    }

    return res.status(200).json({
      success: true,
      message: "Room found",
      room,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, count, image, status } = req.body;

    const room = await RoomModel.findById(id);
    if (!room) {
      return sendNotFound(res, "Room not found");
    }

    const duplicateRoom = await RoomModel.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    });

    if (duplicateRoom) {
      return sendConflict(res, "Room name or slug already exists");
    }

    let updatedImage = image || room.image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/rooms");
      updatedImage = result.secure_url;
    }

    const previousImage = room.image || "";

    const updatedRoom = await RoomModel.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        count: normalizeCount(count, room.count),
        image: updatedImage,
        status: normalizeStatus(status, room.status),
      },
      { new: true, runValidators: true }
    );

    if (previousImage && previousImage !== updatedImage) {
      await deleteFromCloudinary(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    return handleRoomError(res, error);
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);

    if (!room) {
      return sendNotFound(res, "Room not found");
    }

    room.status = !room.status;
    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room status updated successfully",
      room,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const room = await RoomModel.findByIdAndDelete(req.params.id);

    if (!room) {
      return sendNotFound(res, "Room not found");
    }

    await ProductModel.updateMany({ room: room._id }, { $set: { room: null } });
    await deleteFromCloudinary(room.image);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
