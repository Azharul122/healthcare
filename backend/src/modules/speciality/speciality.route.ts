

import express from 'express';
import { specialityController } from './speciality.controller';


const router = express.Router();

router.post("/create", specialityController.createSpecialities)
router.get("/all", specialityController.getAllSpeciality)
router.put("/update/:id", specialityController.updateSpeciality)
router.delete("/delete/:id", specialityController.deleteSpeciality)

export const specialityRouter= router