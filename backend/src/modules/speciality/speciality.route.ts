

import express from 'express';
import { specialityController } from './speciality.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../../genereted/prisma/enums';
import { multerUpload } from '../../configs/multer';
import { validateRequest } from '../../middlewares/validatRequestWithZod';
import { SpecialtyValidation } from './speciality.validation';


const router = express.Router();

router.post("/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    specialityController.createSpecialities)
router.get("/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), specialityController.getAllSpeciality)
router.put("/update/:id", specialityController.updateSpeciality)
router.delete("/delete/:id", specialityController.deleteSpeciality)
router.get("/single/:id", specialityController.getSingleSpeciality)

export const specialityRouter = router