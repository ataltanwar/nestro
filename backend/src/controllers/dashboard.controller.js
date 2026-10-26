import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import RoomModel from "../models/room.model.js";
import ColorModel from "../models/color.model.js";
import SubscriberModel from "../models/subscriber.model.js";
import { sendServerError } from "../utils/response.js";

export const read = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStock,
      totalCategories,
      activeCategories,
      totalRooms,
      activeRooms,
      totalColors,
      activeColors,
      totalSubscribers,
      stockSummary,
      recentProducts,
      recentSubscribers,
    ] = await Promise.all([
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ status: { $ne: false } }),
      ProductModel.countDocuments({ stock: { $lte: 0 } }),
      CategoryModel.countDocuments(),
      CategoryModel.countDocuments({ status: { $ne: false } }),
      RoomModel.countDocuments(),
      RoomModel.countDocuments({ status: { $ne: false } }),
      ColorModel.countDocuments(),
      ColorModel.countDocuments({ status: { $ne: false } }),
      SubscriberModel.countDocuments(),
      ProductModel.aggregate([
        { $group: { _id: null, totalStock: { $sum: "$stock" } } },
      ]),
      ProductModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("category", "name")
        .select("name slug image price salePrice stock status createdAt category"),
      SubscriberModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt"),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard data found",
      stats: {
        totalProducts,
        activeProducts,
        outOfStock,
        totalStock: stockSummary[0]?.totalStock || 0,
        totalCategories,
        activeCategories,
        totalRooms,
        activeRooms,
        totalColors,
        activeColors,
        totalSubscribers,
      },
      recentProducts,
      recentSubscribers,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
