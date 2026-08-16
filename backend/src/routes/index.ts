import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.route";
import { authRouter } from "../modules/auth/auth.route";

const router = Router()

router.use("/speciality", specialityRouter)
router.use("/auth", authRouter)



export const indexRouter = router