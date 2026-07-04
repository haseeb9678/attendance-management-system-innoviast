import { Request, Response } from "express";

import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";

import {
    getStudentDashboardService,
    getMyClassService,
    getMySubjectsService,
    getMySessionsService,

    updateStudentProfileService,
    getMyAttendanceHistoryService,
    getStudentAttendanceSubjectDetailsService,
} from "./student.service.js";

/**
 * Get Student Dashboard
 */
export const getStudentDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const dashboard =
            await getStudentDashboardService(
                req.user.userId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Student dashboard fetched successfully.",
                dashboard
            )
        );
    }
);

/**
 * Get My Class
 */
export const getMyClass = asyncHandler(
    async (req: Request, res: Response) => {
        const classInfo = await getMyClassService(
            req.user.userId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Class fetched successfully.",
                classInfo
            )
        );
    }
);

/**
 * Get My Subjects
 */
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

/**
 * Get My Sessions
 */
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

export const getMyAttendanceHistory = asyncHandler(
    async (req: Request, res: Response) => {
        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : "";

        const sort =
            req.query.sort === "oldest"
                ? "oldest"
                : "newest";

        const history =
            await getMyAttendanceHistoryService({
                studentId: req.user.userId as string,
                search,
                sort,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance history fetched successfully.",
                history
            )
        );
    }
);

export const getStudentAttendanceSubjectDetails = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : "";

        const sort =
            req.query.sort === "oldest"
                ? "oldest"
                : "newest";

        const result =
            await getStudentAttendanceSubjectDetailsService({
                studentId: req.user.userId as string,
                subjectId: req.params.subjectId as string,
                page,
                limit,
                search,
                sort,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance subject details fetched successfully.",
                {
                    subject: result.subject,
                    department: result.department,
                    instructor: result.instructor,
                    stats: result.stats,
                    sessions: result.sessions,

                },
                result.meta
            )
        );
    }
);

/**
 * Update Student Profile
 */
export const updateStudentProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const updatedStudent =
            await updateStudentProfileService(
                req.user.userId as string,
                req.body
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Student profile updated successfully.",
                updatedStudent
            )
        );
    }
);