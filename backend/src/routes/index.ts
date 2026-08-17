import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.route";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.route";

const router = Router()

router.use("/speciality", specialityRouter)
router.use("/auth", authRouter)
router.use("/user", userRouter)



export const indexRouter = router