import { Router } from "express";

import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

import {
    getMyClasses,
    getMySessions,
    getMyStudents,
    getMySubjects,
} from "./instructor.controller.js";

const instructorRouter = Router();

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

export default instructorRouter;