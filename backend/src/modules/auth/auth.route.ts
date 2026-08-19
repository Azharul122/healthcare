import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), authController.getMe)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/verify-email-otp", authController.verifyEmailOtp)
router.post("/forgot", authController.forgotPassword)
router.post("/reset", authController.resetPassword)

router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);

export const authRouter = router