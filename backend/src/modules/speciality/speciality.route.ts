

import express from 'express';
import { specialityController } from './speciality.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../genereted/prisma/enums';


const router = express.Router();

router.post("/create", specialityController.createSpecialities)
router.get("/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), specialityController.getAllSpeciality)
router.put("/update/:id", specialityController.updateSpeciality)
router.delete("/delete/:id", specialityController.deleteSpeciality)
router.get("/single/:id", specialityController.getSingleSpeciality)

export const specialityRouter = router