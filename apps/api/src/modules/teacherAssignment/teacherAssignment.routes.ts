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

const teacherAssignmentRouter = Router();

teacherAssignmentRouter.get("/", getAllTeacherAssignments);

teacherAssignmentRouter.get("/:id", getTeacherAssignment);

teacherAssignmentRouter.post(
    "/",
    validate(createTeacherAssignmentSchema),
    addTeacherAssignment
);

teacherAssignmentRouter.put(
    "/:id",
    validate(createTeacherAssignmentSchema),
    updateTeacherAssignment
);

teacherAssignmentRouter.delete(
    "/:id",
    deleteTeacherAssignment
);

export default teacherAssignmentRouter;