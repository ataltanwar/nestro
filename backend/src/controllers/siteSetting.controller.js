import SiteSettingModel from "../models/siteSetting.model.js";
import { sendBadRequest, sendServerError } from "../utils/response.js";

const allowedFields = [
  "storeName",
  "tagline",
  "supportEmail",
  "supportPhone",
  "supportAddress",
  "supportHours",
  "announcementEnabled",
  "announcementText",
  "newsletterEnabled",
  "instagramUrl",
  "pinterestUrl",
  "youtubeUrl",
];

const requiredTextFields = ["storeName", "supportEmail"];
const booleanFields = ["announcementEnabled", "newsletterEnabled"];
const urlFields = ["instagramUrl", "pinterestUrl", "youtubeUrl"];

const getSettings = () =>
  SiteSettingModel.findOneAndUpdate(
    { key: "site" },
    { $setOnInsert: { key: "site" } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

export const read = async (req, res) => {
  try {
    const settings = await getSettings();

    return res.status(200).json({
      success: true,
      message: "Settings found",
      settings,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const updates = {};

    for (const field of allowedFields) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) continue;

      const value = req.body[field];

      if (booleanFields.includes(field)) {
        if (typeof value !== "boolean") {
          return sendBadRequest(res, `${field} must be true or false`);
        }
        updates[field] = value;
        continue;
      }

      if (typeof value !== "string") {
        return sendBadRequest(res, `${field} must be text`);
      }

      const trimmed = value.trim();

      if (requiredTextFields.includes(field) && !trimmed) {
        return sendBadRequest(res, `${field} is required`);
      }

      if (field === "supportEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return sendBadRequest(res, "Please provide a valid support email");
      }

      if (urlFields.includes(field) && trimmed && !/^https?:\/\/.+/i.test(trimmed)) {
        return sendBadRequest(res, `${field} must start with http:// or https://`);
      }

      updates[field] = trimmed;
    }

    if (Object.keys(updates).length === 0) {
      return sendBadRequest(res, "No settings to update");
    }

    const settings = await SiteSettingModel.findOneAndUpdate(
      { key: "site" },
      { $set: updates, $setOnInsert: { key: "site" } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
