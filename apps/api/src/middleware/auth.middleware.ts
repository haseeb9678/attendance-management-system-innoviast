import { RequestHandler } from "express";
import ApiError from "../shared/utils/ApiError.js";
import { verifyAccessToken } from "../shared/utils/jwt.js";

export const auth: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(
            new ApiError(401, "Unauthorized")
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyAccessToken(token);

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