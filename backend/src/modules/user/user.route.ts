import { Router } from "express";
import { userController } from "./user.controller";

const router= Router()

router.post("/create",userController.createDoctor) 

export const userRouter= router