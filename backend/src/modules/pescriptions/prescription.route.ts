import { Router } from "express";
import { prescriptionController } from "./prescription.controller";


const router = Router();


router.post('/give-prescription', prescriptionController.givePrescription)
router.get('/my-prescriptions', prescriptionController.myPrescriptions)




export const prescriptionRouter = router