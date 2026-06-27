import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import {
    addClassService,
    deleteClassService,
    getAllClassesService,
    getClassService,
    updateClassService,
} from "./class.service.js";

/**
 * Create Class
 */
export const addClass = asyncHandler(async (req, res) => {
    const newClass = await addClassService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "Class created successfully.",
            newClass
        )
    );
});

/**
 * Get All Classes
 */
export const getAllClasses = asyncHandler(async (req, res) => {
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

    const status =
        req.query.status === "active" ||
            req.query.status === "inactive"
            ? req.query.status
            : undefined;

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest";

    const { classes, meta } = await getAllClassesService({
        page,
        limit,
        search,
        department,
        status,
        sort,
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Classes fetched successfully.",
            classes,
            meta
        )
    );
});

/**
 * Get Class By ID
 */
export const getClass = asyncHandler(async (req, res) => {
    const classData = await getClassService(
        req.params.id as string
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Class fetched successfully.",
            classData
        )
    );
});

/**
 * Update Class
 */
export const updateClass = asyncHandler(async (req, res) => {
    const classData = await updateClassService(
        req.params.id as string,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Class updated successfully.",
            classData
        )
    );
});

/**
 * Delete Class
 */
export const deleteClass = asyncHandler(async (req, res) => {
    await deleteClassService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "Class deleted successfully.",
            null
        )
    );
});