import { Router } from "express";

import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

import {
    getStudentDashboard,
    getMyClass,
    getMySubjects,
    getMySessions,
    getMyAttendanceHistory,
    getStudentAttendanceSubjectDetails,
    updateStudentProfile,
} from "./student.controller.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const studentRouter = Router();

studentRouter.get(
    "/dashboard",
    auth,
    authorize("student"),
    getStudentDashboard
);

studentRouter.get(
    "/class",
    auth,
    authorize("student"),
    getMyClass
);

studentRouter.get(
    "/subjects",
    auth,
    authorize("student"),
    getMySubjects
);

studentRouter.get(
    "/sessions",
    auth,
    authorize("student"),
    getMySessions
);

/**
 * Subject-wise attendance summary
 */
studentRouter.get(
    "/attendance/history",
    auth,
    authorize("student"),
    getMyAttendanceHistory
);

/**
 * Session-wise attendance details of a specific subject
 */
studentRouter.get(
    "/attendance/history/subject/:subjectId",
    auth,
    authorize("student"),
    getStudentAttendanceSubjectDetails
);

studentRouter.put(
    "/profile",
    auth,
    authorize("student"),
    blockDemoAccount,
    updateStudentProfile
);

export default studentRouter;