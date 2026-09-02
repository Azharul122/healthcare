import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.route";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.route";
import { doctorRouter } from "../modules/doctor/doctor.route";
import { ScheduleRouter } from "../modules/schedule/schedule.route";
import { appoinmentRouter } from "../modules/appoinments/appoinment.route";
import { patientRouter } from "../modules/patient/patient.route";
import { reviewRouter } from "../modules/review/review.route";

const router = Router()

router.use("/speciality", specialityRouter)
router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/doctor", doctorRouter)
router.use("/schedule", ScheduleRouter)
router.use("/appointment", appoinmentRouter)
router.use("/patient", patientRouter)
router.use("/review", reviewRouter)



export const indexRouter = router