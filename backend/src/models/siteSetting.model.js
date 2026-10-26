import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "site",
    },
    storeName: {
      type: String,
      trim: true,
      default: "Nestro",
      maxLength: 60,
    },
    tagline: {
      type: String,
      trim: true,
      default: "Curated furniture for thoughtful homes. Crafted with intention, made to endure.",
      maxLength: 200,
    },
    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "hello@nestro.com",
      maxLength: 120,
    },
    supportPhone: {
      type: String,
      trim: true,
      default: "+91 98290 00000",
      maxLength: 40,
    },
    supportAddress: {
      type: String,
      trim: true,
      default: "14 Amber Lane, Jodhpur, Rajasthan 342001",
      maxLength: 200,
    },
    supportHours: {
      type: String,
      trim: true,
      default: "Monday to Saturday, 10am - 7pm",
      maxLength: 120,
    },
    announcementEnabled: {
      type: Boolean,
      default: false,
    },
    announcementText: {
      type: String,
      trim: true,
      default: "Complimentary white-glove delivery on orders above Rs. 25,000",
      maxLength: 180,
    },
    newsletterEnabled: {
      type: Boolean,
      default: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
      default: "",
      maxLength: 250,
    },
    pinterestUrl: {
      type: String,
      trim: true,
      default: "",
      maxLength: 250,
    },
    youtubeUrl: {
      type: String,
      trim: true,
      default: "",
      maxLength: 250,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettingModel = mongoose.model("SiteSetting", siteSettingSchema);
export default SiteSettingModel;
