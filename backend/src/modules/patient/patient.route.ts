import { Router } from "express";
import { patientController } from "./patient.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { PatientValidation } from "./patient.validation";
import { multerUpload } from "../../configs/multer";


const router = Router()


router.patch("/update-profile", checkAuth(Role.PATIENT), multerUpload.fields([
    {
        name: "profilePhoto",
        maxCount: 1
    },
    {
        name: "medicalReports",
        maxCount: 6
    }
]), validateRequest(PatientValidation.updatePatientProfileZodSchema), patientController.updatePatientProfile)

export const patientRouter = router