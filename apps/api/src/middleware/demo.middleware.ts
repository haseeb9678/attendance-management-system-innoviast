import { RequestHandler } from "express";
import ApiError from "../shared/utils/ApiError.js";

export const blockDemoAccount: RequestHandler = (req, res, next) => {
    if (!req.user) {
        return next(
            new ApiError(401, "Unauthorized")
        );
    }

    if (req.user.isDemo) {
        return next(
            new ApiError(
                403,
                "This action is disabled for demo accounts."
            )
        );
    }

    next();
};