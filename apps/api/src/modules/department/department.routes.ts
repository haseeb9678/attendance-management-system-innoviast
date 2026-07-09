import { Router } from "express";
import { createDepartmentSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartment,
    updateDepartment,
} from "./department.controller.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";

const departmentRouter = Router();


departmentRouter.get("/", getAllDepartments);
departmentRouter.get("/:id", getDepartment);

departmentRouter.post(
    "/",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createDepartmentSchema),
    addDepartment
);

departmentRouter.put(
    "/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createDepartmentSchema),
    updateDepartment
);

departmentRouter.delete("/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    deleteDepartment);

export default departmentRouter;