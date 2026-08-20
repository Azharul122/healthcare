import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { ScheduleController } from "./schedule.controller";
import { ScheduleValidation } from "./shcedule.validation";


const router = Router();

router.post('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema) , ScheduleController.createSchedule);