import { Router } from "express";
import { createClassSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addClass,
    deleteClass,
    getAllClasses,
    getClass,
    updateClass,
} from "./class.controller.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";

const classRouter = Router();

classRouter.get("/", getAllClasses);
classRouter.get("/:id", getClass);

classRouter.post(
    "/",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createClassSchema),
    addClass
);

classRouter.put(
    "/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createClassSchema),
    updateClass
);

classRouter.delete("/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    deleteClass);

export default classRouter;