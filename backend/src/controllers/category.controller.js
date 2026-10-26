import CategoryModel from "../models/category.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
} from "../utils/response.js";

const normalizeOptionalNumber = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error("Quantity and price must be valid numbers");
  }

  return parsedValue;
};

export const create = async (req, res) => {
  try {
    const { name, slug, quantity, price, image, status } = req.body;

    if (!name || !slug) {
      return sendBadRequest(res, "Name and slug are required");
    }

    let uploadedImageUrl = image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/categories");
      uploadedImageUrl = result.secure_url;
    }

    const existingCategory = await CategoryModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return sendConflict(
        res,
        `Category already exists with name "${existingCategory.name}" or slug "${existingCategory.slug}"`
      );
    }

    const category = await CategoryModel.create({
      name,
      slug,
      quantity: normalizeOptionalNumber(quantity, undefined),
      price: normalizeOptionalNumber(price, undefined),
      image: uploadedImageUrl,
      status: status === undefined ? true : status === "true" || status === true,
    });

    return res.status(201).json({
      success: true,
      message: `Category "${category.name}" created successfully`,
      category,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return sendConflict(
        res,
        "Category already exists. Please use a different name or slug."
      );
    }

    if (error?.name === "ValidationError") {
      const messages = Object.values(error.errors || {}).map((item) => item.message);
      return sendBadRequest(res, messages[0] || "Invalid category data");
    }

    return sendServerError(res, error);
  }
};

export const read = async (req, res) => {
  try {
    const category = await CategoryModel.find();
    return res.status(200).json({
      message: "Category data found",
      success: true,
      category,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return sendNotFound(res, "Category not found");
    }

    return res.status(200).json({
      success: true,
      message: "Category found",
      category,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, quantity, price, image, status } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return sendNotFound(res, "Category not found");
    }

    const duplicateCategory = await CategoryModel.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    });

    if (duplicateCategory) {
      return sendConflict(res, "Category name or slug already exists");
    }

    let updatedImage = image || category.image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/categories");
      updatedImage = result.secure_url;
    }

    const previousImage = category.image || "";

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        quantity: normalizeOptionalNumber(quantity, category.quantity),
        price: normalizeOptionalNumber(price, category.price),
        image: updatedImage,
        status: status === undefined ? category.status : status === "true" || status === true,
      },
      { new: true, runValidators: true }
    );

    if (previousImage && previousImage !== updatedImage) {
      await deleteFromCloudinary(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    if (error?.message === "Quantity and price must be valid numbers") {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res, error);
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return sendNotFound(res, "Category not found");
    }

    category.status = !category.status;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      category,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return sendNotFound(res, "Category not found");
    }

    await deleteFromCloudinary(category.image);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};