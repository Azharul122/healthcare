import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

router.get("/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getAllDoctors)
router.get("/single/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getSingleDoctor)
router.put("/update/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.updateDoctor)
router.delete("/delete/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.deleteDoctor)

export const doctorRouter = router