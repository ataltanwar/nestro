import ColorModel from "../models/color.model.js";
import ProductModel from "../models/product.model.js";
import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
} from "../utils/response.js";

const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const normalizeStatus = (status, fallback = true) => {
  if (status === undefined) {
    return fallback;
  }

  return status === "true" || status === true;
};

const handleColorError = (res, error) => {
  if (error?.code === 11000) {
    return sendConflict(res, "Color already exists. Please use a different name.");
  }

  if (error?.name === "ValidationError") {
    const messages = Object.values(error.errors || {}).map((item) => item.message);
    return sendBadRequest(res, messages[0] || "Invalid color data");
  }

  return sendServerError(res, error);
};

export const create = async (req, res) => {
  try {
    const { name, value, status } = req.body;

    if (!name || !value) {
      return sendBadRequest(res, "Name and color value are required");
    }

    if (!hexPattern.test(value)) {
      return sendBadRequest(res, "Color value must be a valid hex code, for example #8a6040");
    }

    const existingColor = await ColorModel.findOne({ name });
    if (existingColor) {
      return sendConflict(res, `Color already exists with name "${existingColor.name}"`);
    }

    const color = await ColorModel.create({
      name,
      value,
      status: normalizeStatus(status),
    });

    return res.status(201).json({
      success: true,
      message: `Color "${color.name}" created successfully`,
      color,
    });
  } catch (error) {
    return handleColorError(res, error);
  }
};

export const read = async (req, res) => {
  try {
    const colors = await ColorModel.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Color data found",
      colors,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readOne = async (req, res) => {
  try {
    const color = await ColorModel.findById(req.params.id);

    if (!color) {
      return sendNotFound(res, "Color not found");
    }

    return res.status(200).json({
      success: true,
      message: "Color found",
      color,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, status } = req.body;

    if (value !== undefined && !hexPattern.test(value)) {
      return sendBadRequest(res, "Color value must be a valid hex code, for example #8a6040");
    }

    const color = await ColorModel.findById(id);
    if (!color) {
      return sendNotFound(res, "Color not found");
    }

    const duplicateColor = await ColorModel.findOne({
      name,
      _id: { $ne: id },
    });

    if (duplicateColor) {
      return sendConflict(res, "Color name already exists");
    }

    const updatedColor = await ColorModel.findByIdAndUpdate(
      id,
      {
        name,
        value,
        status: normalizeStatus(status, color.status),
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Color updated successfully",
      color: updatedColor,
    });
  } catch (error) {
    return handleColorError(res, error);
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const color = await ColorModel.findById(req.params.id);

    if (!color) {
      return sendNotFound(res, "Color not found");
    }

    color.status = !color.status;
    await color.save();

    return res.status(200).json({
      success: true,
      message: "Color status updated successfully",
      color,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const color = await ColorModel.findByIdAndDelete(req.params.id);

    if (!color) {
      return sendNotFound(res, "Color not found");
    }

    await ProductModel.updateMany({ color: color._id }, { $set: { color: null } });

    return res.status(200).json({
      success: true,
      message: "Color deleted successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
