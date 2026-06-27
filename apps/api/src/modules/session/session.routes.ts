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

const sessionRouter = Router();

sessionRouter.get("/", getAllSessions);
sessionRouter.get("/:id", getSession);

sessionRouter.post(
    "/",
    validate(createSessionSchema),
    addSession
);

sessionRouter.put(
    "/:id",
    validate(createSessionSchema),
    updateSession
);

sessionRouter.delete("/:id", deleteSession);

export default sessionRouter;