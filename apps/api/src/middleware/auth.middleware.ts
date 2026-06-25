import { RequestHandler } from "express";

import ApiError from "../shared/utils/ApiError";
import { verifyAccessToken } from "../shared/utils/jwt";

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