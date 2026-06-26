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

const departmentRouter = Router();


departmentRouter.get("/", getAllDepartments);
departmentRouter.get("/:id", getDepartment);

departmentRouter.post(
    "/",
    validate(createDepartmentSchema),
    addDepartment
);

departmentRouter.put(
    "/:id",
    validate(createDepartmentSchema),
    updateDepartment
);

departmentRouter.delete("/:id", deleteDepartment);

export default departmentRouter;