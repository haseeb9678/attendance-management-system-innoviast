import { Router } from "express";
import { createSubjectSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addSubject,
    deleteSubject,
    getAllSubjects,
    getSubject,
    updateSubject,
} from "./subject.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const subjectRouter = Router();

subjectRouter.get("/", getAllSubjects);
subjectRouter.get("/:id", getSubject);

subjectRouter.post(
    "/",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createSubjectSchema),
    addSubject
);

subjectRouter.put(
    "/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createSubjectSchema),
    updateSubject
);

subjectRouter.delete("/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    deleteSubject);

export default subjectRouter;