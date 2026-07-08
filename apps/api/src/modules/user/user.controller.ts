import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import { getClassOverviewService } from "../instructor/instructor.service.js";
import {
    addUserService,
    deleteUserService,
    getAllUsersService,
    getUserService,
    updatePasswordService,
    updateUserService,
} from "./user.service.js";

/**
 * Create User
 */
export const addUser = asyncHandler(async (req, res) => {
    const user = await addUserService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "User created successfully.",
            user
        )
    );
});

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
 * Get All Users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : "";

    const role =
        req.query.role === "admin" ||
            req.query.role === "instructor" ||
            req.query.role === "student"
            ? req.query.role
            : undefined;

    const department =
        typeof req.query.department === "string"
            ? req.query.department
            : undefined;

    const classId =
        typeof req.query.class === "string"
            ? req.query.class
            : undefined;

    const status =
        req.query.status === "active" ||
            req.query.status === "inactive" ||
            req.query.status === "suspended"
            ? req.query.status
            : undefined;

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest";

    const { users, meta } = await getAllUsersService({
        page,
        limit,
        search,
        role,
        department,
        class: classId,
        status,
        sort,
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully.",
            users,
            meta
        )
    );
});

/**
 * Get User By ID
 */
export const getUser = asyncHandler(async (req, res) => {
    const user = await getUserService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            user
        )
    );
});

/**
 * Update User
 */
export const updateUser = asyncHandler(async (req, res) => {
    const user = await updateUserService(
        req.params.id as string,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "User updated successfully.",
            user
        )
    );
});

export const updatePassword = asyncHandler(
    async (req, res) => {
        await updatePasswordService({
            userId: req.user.userId as string,
            currentPassword:
                req.body.currentPassword,
            newPassword:
                req.body.newPassword,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                "Password updated successfully.",
                null
            )
        );
    }
);

/**
 * Delete User
 */
export const deleteUser = asyncHandler(async (req, res) => {
    await deleteUserService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "User deleted successfully.",
            null
        )
    );
});