import express from "express";
const router = express.Router();

import { addImages, create, read, readOne, removeImage, update, remove } from "../controllers/product.controller.js";
import { upload } from "../utils/upload.js";

router.post("/create", upload.single("imageFile"), create);
router.get("/", read);
router.get("/:id", readOne);
router.post("/:id/images", upload.array("imageFiles", 10), addImages);
router.delete("/:id/images", removeImage);
router.put("/:id", upload.single("imageFile"), update);
router.delete("/:id", remove);

export default router;
