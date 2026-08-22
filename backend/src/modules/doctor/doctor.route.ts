import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

router.get("/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), doctorController.getAllDoctors)
router.get("/single/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getSingleDoctor)
router.put("/update/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.updateDoctor)
router.delete("/delete/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.deleteDoctor)

// router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.createDoctor)
router.post("/create-schedule", checkAuth(Role.DOCTOR), doctorController.createDoctorShedules)
router.get("/my-schedule",checkAuth(Role.DOCTOR), doctorController.getMeSchedules)
router.get("/all-schedule", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getAllDoctorSchedules)

router.get("/single-schedule/:doctorId/:scheduleId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getDoctorScheduleById)

router.delete("/delete-schedule/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.deleteDoctorSchedule)


export const doctorRouter = router