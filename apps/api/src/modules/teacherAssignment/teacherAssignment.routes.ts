import { Router } from "express";
import { createTeacherAssignmentSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addTeacherAssignment,
    deleteTeacherAssignment,
    getAllTeacherAssignments,
    getTeacherAssignment,
    updateTeacherAssignment,
} from "./teacherAssignment.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const teacherAssignmentRouter = Router();

teacherAssignmentRouter.get("/", getAllTeacherAssignments);

teacherAssignmentRouter.get("/:id", getTeacherAssignment);

teacherAssignmentRouter.post(
    "/",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createTeacherAssignmentSchema),
    addTeacherAssignment
);

teacherAssignmentRouter.put(
    "/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createTeacherAssignmentSchema),
    updateTeacherAssignment
);

teacherAssignmentRouter.delete(
    "/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    deleteTeacherAssignment
);

export default teacherAssignmentRouter;