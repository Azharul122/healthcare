import { Router } from "express";
import { doctorController } from "./doctor.controller";


const router = Router()

router.get("/all", doctorController.getAllDoctors)
router.get("/single/:id", doctorController.getSingleDoctor)
router.put("/update/:id", doctorController.updateDoctor)
router.delete("/delete/:id", doctorController.deleteDoctor)

export const doctorRouter = router