import express from "express";
const router = express.Router();

import { subscribe } from "../controllers/subscriber.controller.js";

router.post("/", subscribe);

export default router;
