import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import {
    adminUpdateUserService,
    getAdminAttendanceHistoryService,
    getAdminAttendanceHistoryStatsService,
    getAdminAttendanceSessionDetailsService,
    getAdminDashboardStatsService, updateAdminProfileService
} from "./admin.service.js";


import { Request, Response } from "express";

export const getAdminAttendanceHistoryStats = asyncHandler(
    async (req: Request, res: Response) => {
        const stats =
            await getAdminAttendanceHistoryStatsService();

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin attendance history statistics fetched successfully.",
                stats
            )
        );
    }
);

export const getAdminAttendanceHistory = asyncHandler(
    async (req: Request, res: Response) => {
        const attendanceHistory =
            await getAdminAttendanceHistoryService({
                page: req.query.page
                    ? Number(req.query.page)
                    : 1,
                limit: req.query.limit
                    ? Number(req.query.limit)
                    : 10,
                search: req.query.search as string,
                departmentId:
                    req.query.departmentId as string,
                classId: req.query.classId as string,
                subjectId:
                    req.query.subjectId as string,
                instructorId:
                    req.query.instructorId as string,
                status: req.query.status as string,
                startDate:
                    req.query.startDate as string,
                endDate:
                    req.query.endDate as string,
                sortBy: req.query.sortBy as
                    | "newest"
                    | "oldest"
                    | "highest_attendance"
                    | "lowest_attendance",
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin attendance history fetched successfully.",
                attendanceHistory
            )
        );
    }
);

export const getAdminAttendanceSessionDetails = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const sessionDetails =
            await getAdminAttendanceSessionDetailsService(
                req.params.sessionId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Session attendance details fetched successfully.",
                sessionDetails
            )
        );
    }
);


export const getAdminDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const dashboard =
            await getAdminDashboardStatsService();

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin dashboard fetched successfully.",
                dashboard
            )
        );
    }
);

export const updateAdminProfile = asyncHandler(
    async (req: Request, res: Response) => {

        const updatedAdmin = await updateAdminProfileService(
            req.user.userId as string,
            req.body
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin profile updated successfully.",
                updatedAdmin
            )
        );
    }
);

export const updateUser = asyncHandler(
    async (req: Request, res: Response) => {
        const updatedUser =
            await adminUpdateUserService(req.body);

        res.status(200).json(
            new ApiResponse(
                200,
                "User updated successfully.",
                updatedUser
            )
        );
    }
);