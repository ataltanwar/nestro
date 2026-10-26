import express from "express";
const router = express.Router();

import { read } from "../controllers/dashboard.controller.js";

router.get("/", read);

export default router;
