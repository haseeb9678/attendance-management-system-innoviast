import { RequestHandler } from "express";

import ApiError from "../shared/utils/ApiError.js";

import {
    UserRole,
} from "@attendance/shared-types";

export const authorize =
    (...roles: UserRole[]): RequestHandler =>
        (req, res, next) => {

            if (!req.user) {
                return next(
                    new ApiError(
                        401,
                        "Unauthorized"
                    )
                );
            }

            if (
                !roles.includes(
                    req.user.role
                )
            ) {
                return next(
                    new ApiError(
                        403,
                        "Forbidden"
                    )
                );
            }

            next();
        };