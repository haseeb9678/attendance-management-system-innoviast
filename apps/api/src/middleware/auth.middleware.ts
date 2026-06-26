import { RequestHandler } from "express";

import ApiError from "../shared/utils/ApiError.js";
import { verifyAccessToken } from "../shared/utils/jwt.js";

export const auth: RequestHandler =
    async (req, res, next) => {

        const token =
            req.cookies?.accessToken;

        if (!token) {
            return next(
                new ApiError(
                    401,
                    "Unauthorized"
                )
            );
        }

        try {

            const decoded =
                verifyAccessToken(token);

            req.user = decoded;

            next();

        } catch {

            next(
                new ApiError(
                    401,
                    "Invalid or expired token"
                )
            );
        }
    };