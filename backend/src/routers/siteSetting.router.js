import express from "express";
const router = express.Router();

import { read, update } from "../controllers/siteSetting.controller.js";

router.get("/", read);
router.put("/", update);

export default router;
