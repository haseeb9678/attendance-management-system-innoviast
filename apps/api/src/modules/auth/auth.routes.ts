import { Router } from "express";

import validate from "../../middleware/validate.middleware";

import { loginSchema, registerSchema }
    from "@attendance/shared-zod";

import { login, logout, me, register }
    from "./auth.controller";
import { auth } from "../../middleware/auth.middleware";

const authRouter = Router();

authRouter.get(
    "/me",
    auth,
    me
);


authRouter.post(
    "/register",
    validate(registerSchema),
    register
);
authRouter.post(
    "/login",
    validate(loginSchema),
    login
);
authRouter.post(
    "/logout",
    auth,
    logout
);


export default authRouter;