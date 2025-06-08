import express from "express";
import {
  createUser,
  get_All_Users_Controller,
} from "../controllers/user_controller.js";

const userRouter = express.Router();

userRouter.get("/users/all", get_All_Users_Controller);
userRouter.post("/users/create", createUser);

export default userRouter;
