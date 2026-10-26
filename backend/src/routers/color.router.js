import express from "express";
const router = express.Router();

import {
  create,
  read,
  readOne,
  update,
  toggleStatus,
  remove,
} from "../controllers/color.controller.js";

router.post("/create", create);
router.get("/", read);
router.get("/:id", readOne);
router.put("/:id", update);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", remove);

export default router;
