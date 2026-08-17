import { Router } from "express";
import { doctorController } from "./doctor.controller";


const router= Router()

router.get("/all", doctorController.getAllDoctors)

export const doctorRouter= router