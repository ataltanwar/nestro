import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import categoryRouter from './routers/category.router.js';
import productRouter from './routers/product.router.js';
import subscriberRouter from './routers/subscriber.router.js';
import roomRouter from './routers/room.router.js';
import colorRouter from './routers/color.router.js';
import dashboardRouter from './routers/dashboard.router.js';
import siteSettingRouter from './routers/siteSetting.router.js';

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());
server.use("/api/category", categoryRouter);
server.use("/api/product", productRouter);
server.use("/api/subscribe", subscriberRouter);
server.use("/api/rooms", roomRouter);
server.use("/api/colors", colorRouter);
server.use("/api/dashboard", dashboardRouter);
server.use("/api/settings", siteSettingRouter);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  });