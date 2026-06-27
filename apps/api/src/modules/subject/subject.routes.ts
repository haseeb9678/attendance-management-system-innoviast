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

const subjectRouter = Router();

subjectRouter.get("/", getAllSubjects);
subjectRouter.get("/:id", getSubject);

subjectRouter.post(
    "/",
    validate(createSubjectSchema),
    addSubject
);

subjectRouter.put(
    "/:id",
    validate(createSubjectSchema),
    updateSubject
);

subjectRouter.delete("/:id", deleteSubject);

export default subjectRouter;