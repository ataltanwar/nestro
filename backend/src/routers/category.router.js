import express from "express";
const router = express.Router();
import { create, read, readOne, update, toggleStatus, remove } from "../controllers/category.controller.js";
import { upload } from "../utils/upload.js";

router.post("/create", upload.single("imageFile"), create);
router.get("/", read);
router.get("/:id", readOne);
router.put("/:id", upload.single("imageFile"), update);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", remove);

export default router