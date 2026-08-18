import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { createDoctorSchema } from "../../schema/doctor";
import { changePasswordZodSchema } from "../../schema/user";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";

const router = Router()

router.post(
    "/create",
    validateRequest(createDoctorSchema),
    userController.createDoctor
);
router.put(
    "/change-password", validateRequest(changePasswordZodSchema), checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
    userController.chnagePassword)



export const userRouter = router