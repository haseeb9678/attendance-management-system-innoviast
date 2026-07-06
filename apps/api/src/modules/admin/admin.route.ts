import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { getAdminDashboard, updateAdminProfile } from "./admin.controller.js";

const adminRouter = Router()

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

export default adminRouter;