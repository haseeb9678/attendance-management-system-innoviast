import { Router } from "express";

import validate from "../../middleware/validate.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";

import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verifyResetTokenSchema
} from "@attendance/shared-zod";

import {
    forgotPassword,
    login,
    logout,
    me,
    refreshToken,
    register,
    resetPassword,
    verifyResetToken,
} from "./auth.controller.js";
import { blockDemoAccount } from "../../middleware/demo.middleware.js";

const authRouter = Router();

authRouter.get(
    "/me",
    auth,
    me
);

authRouter.post(
    "/register",
    validate(registerSchema),
    blockDemoAccount,
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

authRouter.post(
    "/verify-reset-token",
    validate(verifyResetTokenSchema),
    verifyResetToken
);

authRouter.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
);

authRouter.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

export default authRouter;