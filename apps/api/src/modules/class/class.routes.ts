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

const classRouter = Router();

classRouter.get("/", getAllClasses);
classRouter.get("/:id", getClass);

classRouter.post(
    "/",
    validate(createClassSchema),
    addClass
);

classRouter.put(
    "/:id",
    validate(createClassSchema),
    updateClass
);

classRouter.delete("/:id", deleteClass);

export default classRouter;