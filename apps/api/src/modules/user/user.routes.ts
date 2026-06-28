import { Router } from "express";
import { createUserSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} from "./user.controller.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

userRouter.post(
    "/",
    validate(createUserSchema),
    addUser
);

userRouter.put(
    "/:id",
    validate(createUserSchema),
    updateUser
);

userRouter.delete("/:id", deleteUser);

export default userRouter;