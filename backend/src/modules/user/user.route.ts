import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { createDoctorSchema } from "../../schema/doctor";

const router = Router()

router.post(
    "/create",
    validateRequest(createDoctorSchema),
    userController.createDoctor
);

export const userRouter = router