import { Router } from "express";

import { AdminController } from "./admin.controller";

import { Role } from "../../genereted/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validatRequestWithZod";
import { updateAdminZodSchema } from "../../schema/doctor";

const router = Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAllAdmins);
router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAdminById);
router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(updateAdminZodSchema), AdminController.updateAdmin);
router.delete("/:id",
    checkAuth(Role.SUPER_ADMIN),
    AdminController.deleteAdmin);

export const AdminRoutes = router;