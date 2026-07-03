import { Router } from "express";

import {
    createAttendanceSchema,
} from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

import {
    createAttendance,
    deleteAttendance,
    getSessionAttendance,
    getStudentAttendance,
    updateAttendance,
} from "./attendance.controller.js";

const attendanceRouter = Router();


attendanceRouter.get(
    "/session/:sessionId",
    auth,
    authorize("instructor"),
    getSessionAttendance
);

attendanceRouter.get(
    "/student/:studentId",
    auth,
    getStudentAttendance
);

attendanceRouter.post(
    "/",
    auth,
    authorize("instructor"),
    validate(createAttendanceSchema),
    createAttendance
);

attendanceRouter.put(
    "/session/:sessionId",
    auth,
    authorize("instructor"),
    validate(createAttendanceSchema),
    updateAttendance
);

attendanceRouter.delete(
    "/session/:sessionId",
    auth,
    authorize("instructor"),
    deleteAttendance
);

export default attendanceRouter;