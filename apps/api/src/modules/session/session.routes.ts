import { Router } from "express";
import { createSessionSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";

import {
    addSession,
    deleteSession,
    getAllSessions,
    getSession,
    updateSession,
} from "./session.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const sessionRouter = Router();

sessionRouter.get("/", getAllSessions);
sessionRouter.get("/:id", getSession);

sessionRouter.post(
    "/",
    auth,
    authorize("admin"),
    validate(createSessionSchema),
    addSession
);

sessionRouter.put(
    "/:id",
    auth,
    authorize("admin"),
    validate(createSessionSchema),
    updateSession
);

sessionRouter.delete("/:id",
    auth,
    authorize("admin"),
    deleteSession);

export default sessionRouter;