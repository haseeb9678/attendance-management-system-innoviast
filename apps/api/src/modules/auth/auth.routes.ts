import { Router } from "express";

import validate from "../../middleware/validate.middleware.js";

import { loginSchema, registerSchema }
    from "@attendance/shared-zod";

import { login, logout, me, refreshToken, register }
    from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

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
authRouter.post(
    "/refresh",
    refreshToken
);


export default authRouter;