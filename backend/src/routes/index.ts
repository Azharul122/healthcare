import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.route";

const router= Router()

router.use("/speciality", specialityRouter)


export const indexRouter= router