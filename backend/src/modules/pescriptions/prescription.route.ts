import { Router } from "express";
import { pescriptionController } from "./prescription.controller";


const router = Router();


router.post('/give-prescription', pescriptionController.givePrescription)



export const pescriptionRouter = router