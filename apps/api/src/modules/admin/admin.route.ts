import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import {
    getAdminDashboard,
    updateAdminProfile,
    updateUser,
    getAdminAttendanceHistory,
    getAdminAttendanceSessionDetails,
    getAdminAttendanceHistoryStats,
} from "./admin.controller.js";
import validate from "../../middleware/validate.middleware.js";
import { adminUpdateUserSchema } from "@attendance/shared-zod";

const adminRouter = Router();

adminRouter.get(
    "/dashboard",
    auth,
    authorize("admin"),
    getAdminDashboard
);

adminRouter.put(
    "/profile",
    auth,
    authorize("admin"),
    updateAdminProfile
);

/**
 * Update any user by admin
 */
adminRouter.put(
    "/users/update",
    auth,
    authorize("admin"),
    validate(adminUpdateUserSchema),
    updateUser
);

adminRouter.get(
    "/attendance-history/stats",
    auth,
    authorize("admin"),
    getAdminAttendanceHistoryStats
);

adminRouter.get(
    "/attendance-history",
    auth,
    authorize("admin"),
    getAdminAttendanceHistory
);

adminRouter.get(
    "/attendance-history/:sessionId",
    auth,
    authorize("admin"),
    getAdminAttendanceSessionDetails
);

export default adminRouter;