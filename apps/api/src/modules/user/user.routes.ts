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
import { authorize } from "../../middleware/authorize.middleware.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

userRouter.post(
    "/",
    auth,
    authorize("admin"),
    blockDemoAccount,
    validate(createUserSchema),
    addUser
);

userRouter.put(
    "/:id",
    auth,
    blockDemoAccount,
    validate(createUserSchema),
    updateUser
);

userRouter.patch(
    "/change-password",
    auth,
    blockDemoAccount,
    updatePassword
);

userRouter.delete("/:id",
    auth,
    authorize("admin"),
    blockDemoAccount,
    deleteUser);

export default userRouter;