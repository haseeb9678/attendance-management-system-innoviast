import { Router } from "express";

import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

import {
    getAttendanceHistory,
    getAttendanceStats,
    getClassOverview,
    getInstructorDashboard,
    getMyClasses,
    getMySessions,
    getMyStudents,
    getMySubjects,
    updateInstructorProfile,
} from "./instructor.controller.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const instructorRouter = Router();

instructorRouter.get(
    "/dashboard",
    auth,
    authorize("instructor"),
    getInstructorDashboard
);

instructorRouter.get(
    "/classes/:classId",
    auth,
    authorize("instructor"),
    getClassOverview
);

instructorRouter.get(
    "/attendance-stats",
    auth,
    authorize("instructor"),
    getAttendanceStats
);

instructorRouter.get(
    "/attendance-history",
    auth,
    authorize("instructor"),
    getAttendanceHistory
);


instructorRouter.get(
    "/classes",
    auth,
    authorize("instructor"),
    getMyClasses
);

instructorRouter.get(
    "/subjects",
    auth,
    authorize("instructor"),
    getMySubjects
);

instructorRouter.get(
    "/sessions",
    auth,
    authorize("instructor"),
    getMySessions
);

instructorRouter.get(
    "/students/:classId",
    auth,
    authorize("instructor"),
    getMyStudents
);

instructorRouter.put(
    "/profile",
    auth,
    authorize("instructor"),
    blockDemoAccount,
    updateInstructorProfile
);

export default instructorRouter;