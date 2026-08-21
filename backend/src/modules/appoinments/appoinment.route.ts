import { Router } from "express";
import { appoinmentController } from "./appoinment.controller";


const router = Router()

// router.get("/all", appoinmentController.getAllAppoinments)
// router.get("/single/:id", appoinmentController.getSingleAppoinment)
// router.put("/update/:id", appoinmentController.updateAppoinment)
// router.delete("/delete/:id", appoinmentController.deleteAppoinment)

router.post("/create", appoinmentController.bookAppoinment)
router.patch("/change-status/:id", appoinmentController.changeAppointmentStatus)

router.get("/my-appointments", appoinmentController.getMyAppointments)
// router.get("/all-appointments", appoinmentController.getAllAppoinments)
// router.get("/single/:id", appoinmentController.getSingleAppoinment)
// router.put("/update/:id", appoinmentController.updateAppoinment)
// router.delete("/delete/:id", appoinmentController.deleteAppoinment


export const appoinmentRouter = router

