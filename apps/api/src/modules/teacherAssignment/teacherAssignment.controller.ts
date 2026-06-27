import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import {
    addTeacherAssignmentService,
    deleteTeacherAssignmentService,
    getAllTeacherAssignmentsService,
    getTeacherAssignmentService,
    updateTeacherAssignmentService,
} from "./teacherAssignment.service.js";

/**
 * Create Teacher Assignment
 */
export const addTeacherAssignment = asyncHandler(async (req, res) => {
    const teacherAssignment =
        await addTeacherAssignmentService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "Teacher assignment created successfully.",
            teacherAssignment
        )
    );
});

/**
 * Get All Teacher Assignments
 */
export const getAllTeacherAssignments = asyncHandler(
    async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : "";

        const department =
            typeof req.query.department === "string"
                ? req.query.department
                : undefined;

        const instructor =
            typeof req.query.instructor === "string"
                ? req.query.instructor
                : undefined;

        const classId =
            typeof req.query.class === "string"
                ? req.query.class
                : undefined;

        const subject =
            typeof req.query.subject === "string"
                ? req.query.subject
                : undefined;

        const status =
            req.query.status === "active" ||
                req.query.status === "inactive"
                ? req.query.status
                : undefined;

        const sort =
            req.query.sort === "oldest"
                ? "oldest"
                : "newest";

        const { teacherAssignments, meta } =
            await getAllTeacherAssignmentsService({
                page,
                limit,
                search,
                instructor,
                class: classId,
                subject,
                department,
                status,
                sort,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                "Teacher assignments fetched successfully.",
                teacherAssignments,
                meta
            )
        );
    }
);

/**
 * Get Teacher Assignment By ID
 */
export const getTeacherAssignment = asyncHandler(
    async (req, res) => {
        const teacherAssignment =
            await getTeacherAssignmentService(
                req.params.id as string
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Teacher assignment fetched successfully.",
                teacherAssignment
            )
        );
    }
);

/**
 * Update Teacher Assignment
 */
export const updateTeacherAssignment = asyncHandler(
    async (req, res) => {
        const teacherAssignment =
            await updateTeacherAssignmentService(
                req.params.id as string,
                req.body
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Teacher assignment updated successfully.",
                teacherAssignment
            )
        );
    }
);

/**
 * Delete Teacher Assignment
 */
export const deleteTeacherAssignment = asyncHandler(
    async (req, res) => {
        await deleteTeacherAssignmentService(
            req.params.id as string
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Teacher assignment deleted successfully.",
                null
            )
        );
    }
);