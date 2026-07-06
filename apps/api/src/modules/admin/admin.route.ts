import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { getAdminDashboard, updateAdminProfile } from "./admin.controller";

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