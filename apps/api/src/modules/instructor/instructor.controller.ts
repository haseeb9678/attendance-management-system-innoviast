import { Request, Response } from "express";

import ApiResponse from "../../shared/utils/ApiResponse.js";

import {
    getAttendanceHistoryService,
    getAttendanceStatsService,
    getClassOverviewService,
    getInstructorDashboardService,
    getMyClassesService,
    getMySessionsService,
    getMyStudentsService,
    getMySubjectsService,
    updateInstructorProfileService,
} from "./instructor.service.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import { log } from "console";


export const getInstructorDashboard = asyncHandler(
    async (req, res) => {
        const dashboard =
            await getInstructorDashboardService(
                req.user.userId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Instructor dashboard fetched successfully.",
                dashboard
            )
        );
    }
);
/**
 * Get Instructor Class Overview
 */
export const getClassOverview = asyncHandler(
    async (req, res) => {
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

        const overview =
            await getClassOverviewService({
                instructorId: req.user.userId as string,
                classId: req.params.classId as string,
                page,
                limit,
                search,
                sort,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Class overview fetched successfully.",
                {
                    class: overview.class,
                    subjects: overview.subjects,
                    stats: overview.stats,
                    students: overview.students,
                },
                overview.meta
            )
        );
    }
);
/**
 * Get Attendance Stats
 */
export const getAttendanceStats = asyncHandler(
    async (req, res) => {
        const stats =
            await getAttendanceStatsService(
                req.user.userId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance statistics fetched successfully.",
                stats
            )
        );
    }
);

/**
 * Get Attendance History
 */
export const getAttendanceHistory = asyncHandler(
    async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : "";

        const classId =
            typeof req.query.class === "string"
                ? req.query.class
                : undefined;

        const subject =
            typeof req.query.subject === "string"
                ? req.query.subject
                : undefined;

        const status =
            req.query.status === "completed" ||
                req.query.status === "pending"
                ? req.query.status
                : undefined;

        const sort =
            req.query.sort === "oldest"
                ? "oldest"
                : "newest";

        const { history, meta } =
            await getAttendanceHistoryService({
                instructorId: req.user.userId as string,

                page,
                limit,

                search,

                class: classId,
                subject,

                status,

                sort,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance history fetched successfully.",
                history,
                meta
            )
        );
    }
);

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
export const updateInstructorProfile = asyncHandler(
    async (req: Request, res: Response) => {

        const updatedInstructor = await updateInstructorProfileService(
            req.user.userId as string,
            req.body
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Instructor profile updated successfully.",
                updatedInstructor
            )
        );
    }
);