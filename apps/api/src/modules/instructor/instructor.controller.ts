import { Request, Response } from "express";

import ApiResponse from "../../shared/utils/ApiResponse.js";

import {
    getMyClassesService,
    getMySessionsService,
    getMyStudentsService,
    getMySubjectsService,
} from "./instructor.service.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";

export const getMyClasses = asyncHandler(
    async (req: Request, res: Response) => {
        const classes = await getMyClassesService(
            req.user.userId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Classes fetched successfully.",
                classes
            )
        );
    }
);

export const getMySubjects = asyncHandler(
    async (req: Request, res: Response) => {
        const subjects = await getMySubjectsService(
            req.user.userId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Subjects fetched successfully.",
                subjects
            )
        );
    }
);

export const getMySessions = asyncHandler(
    async (req: Request, res: Response) => {
        const sessions = await getMySessionsService(
            req.user.userId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Sessions fetched successfully.",
                sessions
            )
        );
    }
);

export const getMyStudents = asyncHandler(
    async (req: Request, res: Response) => {
        const students = await getMyStudentsService(
            req.user.userId as string,
            req.params.classId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Students fetched successfully.",
                students
            )
        );
    }
);