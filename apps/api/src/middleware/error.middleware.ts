import { ErrorRequestHandler } from "express";
import ApiError from "../shared/utils/ApiError.js";
import { NODE_ENV } from "../config/env.js";

const errorMiddleware: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {

    let error = err;

    console.error(err);

    // Invalid Mongo ObjectId
    if (err.name === "CastError") {
        error = new ApiError(
            400,
            `Resource not found. Invalid: ${err.path}`
        );
    }

    // Duplicate Key
    if (err.code === 11000) {
        error = new ApiError(
            400,
            `Duplicate ${Object.keys(err.keyValue)} entered`
        );
    }

    // Mongoose Validation
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors)
            .map((val: any) => val.message);

        error = new ApiError(
            400,
            "Validation Error",
            errors
        );
    }

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
            stack:
                NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        stack:
            NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};

export default errorMiddleware;