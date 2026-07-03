import { Router } from "express";
import { createUserSchema, updatePasswordSchema } from "@attendance/shared-zod";

import validate from "../../middleware/validate.middleware.js";
import {
    addUser,
    deleteUser,
    getAllUsers,
    getUser,
    updatePassword,
    updateUser,
} from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

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

userRouter.patch(
    "/change-password",
    auth,
    updatePassword
);

userRouter.delete("/:id", deleteUser);

export default userRouter;