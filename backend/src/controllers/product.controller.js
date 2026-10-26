import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import RoomModel from "../models/room.model.js";
import ColorModel from "../models/color.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
} from "../utils/response.js";

export const create = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      salePrice,
      image,
      category,
      room,
      color,
      stock,
      featured,
      newArrival,
      bestseller,
    } = req.body;

    const finalSalePrice = Number(salePrice ?? price);
    const finalOriginalPrice = Number(originalPrice ?? finalSalePrice);
    const discount = finalOriginalPrice > 0
      ? Math.max(0, Math.round(((finalOriginalPrice - finalSalePrice) / finalOriginalPrice) * 100))
      : 0;

    if (!name || !slug || !description || !category || !Number.isFinite(finalSalePrice) || !Number.isFinite(finalOriginalPrice)) {
      return sendBadRequest(res, "Please provide all required fields");
    }

    if (finalSalePrice > finalOriginalPrice) {
      return sendBadRequest(res, "Sale price cannot be greater than original price");
    }

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return sendBadRequest(res, "Category not found");
    }

    let roomId = null;

    if (room) {
      if (!mongoose.Types.ObjectId.isValid(room)) {
        return sendBadRequest(res, "Please select a valid room");
      }

      const roomExists = await RoomModel.findById(room);
      if (!roomExists) {
        return sendBadRequest(res, "Room not found");
      }

      roomId = room;
    }

    let colorId = null;

    if (color) {
      if (!mongoose.Types.ObjectId.isValid(color)) {
        return sendBadRequest(res, "Please select a valid color");
      }

      const colorExists = await ColorModel.findById(color);
      if (!colorExists) {
        return sendBadRequest(res, "Color not found");
      }

      colorId = color;
    }

    const existingProduct = await ProductModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingProduct) {
      return sendConflict(res, "Product already exists");
    }

    let uploadedImageUrl = image || "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/products");
      uploadedImageUrl = result.secure_url;
    }

    await ProductModel.create({
      name,
      slug,
      description,
      price: finalSalePrice,
      originalPrice: finalOriginalPrice,
      salePrice: finalSalePrice,
      discount,
      image: uploadedImageUrl,
      category,
      room: roomId,
      color: colorId,
      stock,
      featured: featured === "true" || featured === true,
      newArrival: newArrival === "true" || newArrival === true,
      bestseller: bestseller === "true" || bestseller === true,
    });

    return sendCreated(res, "Product created successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const read = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("category", "name slug")
      .populate("room", "name slug")
      .populate("color", "name value");

    return res.status(200).json({
      success: true,
      message: "Product data found",
      products,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readOne = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id)
        .populate("category", "name slug")
        .populate("room", "name slug")
        .populate("color", "name value");
    }

    if (!product) {
      product = await ProductModel.findOne({ slug: id })
        .populate("category", "name slug")
        .populate("room", "name slug")
        .populate("color", "name value");
    }

    if (!product) {
      return sendNotFound(res, "Product not found");
    }

    return res.status(200).json({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const addImages = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return sendNotFound(res, "Product not found");
    if (!req.files?.length) return sendBadRequest(res, "Please select at least one image");

    const currentImages = [...new Set([...(product.image ? [product.image] : []), ...(product.images || [])])];
    if (currentImages.length + req.files.length > 4) {
      return sendBadRequest(res, "A product can have a maximum of 4 images");
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, "nestro/products");
        return result.secure_url;
      })
    );

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: uploadedImages } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product images uploaded successfully",
      images: updatedProduct.images,
      product: updatedProduct,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const removeImage = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return sendNotFound(res, "Product not found");

    const imageUrl = req.body.image;
    if (!imageUrl) return sendBadRequest(res, "Image URL is required");

    const gallery = [...new Set([...(product.image ? [product.image] : []), ...(product.images || [])])];
    if (!gallery.includes(imageUrl)) return sendNotFound(res, "Image not found");

    if (imageUrl === product.image) {
      return sendBadRequest(res, "The thumbnail can only be changed from Edit Product");
    }

    product.images = (product.images || []).filter((image) => image !== imageUrl);
    await product.save();
    await deleteFromCloudinary(imageUrl);

    return res.status(200).json({ success: true, message: "Product image removed successfully", product });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return sendNotFound(res, "Product not found");

    const { name, slug, description, price, originalPrice, salePrice, category, room, color, stock, featured, newArrival, bestseller, image } = req.body;
    const finalSalePrice = Number(salePrice ?? price);
    const finalOriginalPrice = Number(originalPrice ?? finalSalePrice);
    if (finalSalePrice > finalOriginalPrice) return sendBadRequest(res, "Sale price cannot be greater than original price");

    let roomId = product.room || null;

    if (room !== undefined) {
      if (!room) {
        roomId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(room)) return sendBadRequest(res, "Please select a valid room");
        const roomExists = await RoomModel.findById(room);
        if (!roomExists) return sendBadRequest(res, "Room not found");
        roomId = room;
      }
    }

    let colorId = product.color || null;

    if (color !== undefined) {
      if (!color) {
        colorId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(color)) return sendBadRequest(res, "Please select a valid color");
        const colorExists = await ColorModel.findById(color);
        if (!colorExists) return sendBadRequest(res, "Color not found");
        colorId = color;
      }
    }

    const previousImage = product.image || "";
    let updatedImage = image || product.image || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "nestro/products");
      updatedImage = result.secure_url;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
      name,
      slug,
      description,
      price: finalSalePrice,
      originalPrice: finalOriginalPrice,
      salePrice: finalSalePrice,
      discount: finalOriginalPrice > 0 ? Math.max(0, Math.round(((finalOriginalPrice - finalSalePrice) / finalOriginalPrice) * 100)) : 0,
      image: updatedImage,
      category,
      room: roomId,
      color: colorId,
      stock,
      featured: featured === "true" || featured === true,
      newArrival: newArrival === "true" || newArrival === true,
      bestseller: bestseller === "true" || bestseller === true,
    }, { new: true, runValidators: true })
      .populate("category", "name slug")
      .populate("room", "name slug")
      .populate("color", "name value");

    if (previousImage && previousImage !== updatedImage) {
      await deleteFromCloudinary(previousImage);
    }

    return res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) return sendNotFound(res, "Product not found");

    await deleteFromCloudinary([product.image, ...(product.images || [])]);

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return sendServerError(res, error);
  }
};
