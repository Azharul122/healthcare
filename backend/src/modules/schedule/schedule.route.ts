import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../genereted/prisma/enums";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { ScheduleController } from "./schedule.controller";
import { ScheduleValidation } from "./shcedule.validation";


const router = Router();

router.post('/create',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    validateRequest(ScheduleValidation.createScheduleZodSchema),
    ScheduleController.createSchedule);

router.get('/all',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    ScheduleController.getAllSchedules)

router.put('/update/:id',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    ScheduleController.updateSchedule)

router.delete('/delete/:id',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    ScheduleController.deleteSchedule)

router.get('/single/:id',
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    ScheduleController.getScheduleById)



export const ScheduleRouter = router