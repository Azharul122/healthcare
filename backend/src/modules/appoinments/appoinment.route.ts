import { Router } from "express";
import { appoinmentController } from "./appoinment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";


const router = Router()

// router.get("/all", appoinmentController.getAllAppoinments)
// router.get("/single/:id", appoinmentController.getSingleAppoinment)
// router.put("/update/:id", appoinmentController.updateAppoinment)
// router.delete("/delete/:id", appoinmentController.deleteAppoinment)

router.post("/create", checkAuth(Role.PATIENT), appoinmentController.bookAppoinment)
router.patch("/change-status/:id", appoinmentController.changeAppointmentStatus)
router.get("/my-appointments", appoinmentController.getMyAppointments)
router.get("/single/:id", appoinmentController.getMySingleApointments)
router.get("/all-appointments", appoinmentController.getAllAppointment)
router.post("/book-with-pay-later", checkAuth(Role.PATIENT), appoinmentController.bookAppointmentWithPayLater)




// router.get("/single/:id", appoinmentController.getSingleAppoinment)
// router.put("/update/:id", appoinmentController.updateAppoinment)
// router.delete("/delete/:id", appoinmentController.deleteAppoinment


export const appoinmentRouter = router

