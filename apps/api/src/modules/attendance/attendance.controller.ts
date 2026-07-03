import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";

import {
    createAttendanceService,
    getSessionAttendanceService,
    getStudentAttendanceService,
    updateAttendanceService,
    deleteAttendanceService,
} from "./attendance.service.js";



/**
 * Create Attendance
 */
export const createAttendance = asyncHandler(
    async (req, res) => {
        const attendance =
            await createAttendanceService(
                req.user.userId as string,
                req.body
            );

        res.status(201).json(
            new ApiResponse(
                201,
                "Attendance marked successfully.",
                attendance
            )
        );
    }
);

/**
 * Get Session Attendance
 */
export const getSessionAttendance = asyncHandler(
    async (req, res) => {
        const attendance =
            await getSessionAttendanceService(
                req.user.userId as string,
                req.params.sessionId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance fetched successfully.",
                attendance
            )
        );
    }
);

/**
 * Get Student Attendance
 */
export const getStudentAttendance = asyncHandler(
    async (req, res) => {
        const attendance =
            await getStudentAttendanceService(
                req.params.studentId as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Student attendance fetched successfully.",
                attendance
            )
        );
    }
);

/**
 * Update Attendance
 */
export const updateAttendance = asyncHandler(
    async (req, res) => {
        const attendance =
            await updateAttendanceService(
                req.user.userId as string,
                req.params.sessionId as string,
                req.body
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance updated successfully.",
                attendance
            )
        );
    }
);

/**
 * Delete Attendance
 */
export const deleteAttendance = asyncHandler(
    async (req, res) => {
        await deleteAttendanceService(
            req.user.userId as string,
            req.params.sessionId as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Attendance deleted successfully.",
                null
            )
        );
    }
);