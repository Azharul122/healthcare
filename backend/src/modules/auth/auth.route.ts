import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),  authController.getMe)


export const authRouter = router