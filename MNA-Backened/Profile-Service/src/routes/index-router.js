import express from "express";
import userRouter from "./users-routes.js";
const indexRouter = express.Router();

indexRouter.use(userRouter);

export default indexRouter;
