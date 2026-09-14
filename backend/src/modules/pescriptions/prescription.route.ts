import { Router } from "express";
import { prescriptionController } from "./prescription.controller";


const router = Router();


router.post('/give-prescription', prescriptionController.givePrescription)
router.get('/my-prescriptions', prescriptionController.myPrescriptions)
router.get('/all-prescriptions', prescriptionController.getAllPrescriptions)
router.patch('/update-prescription/:id', prescriptionController.updatePrescription)



export const prescriptionRouter = router