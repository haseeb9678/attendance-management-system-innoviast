import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import {
    addDepartmentService,
    deleteDepartmentService,
    getAllDepartmentsService,
    getDepartmentService,
    updateDepartmentService,
} from "./department.service.js";




/**
 * Create Department
 */
export const addDepartment = asyncHandler(async (req, res) => {
    const department = await addDepartmentService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "Department created successfully.",
            department
        )
    );
});

/**
 * Get All Departments
 */
export const getAllDepartments = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : "";

    const status =
        req.query.status === "active" || req.query.status === "inactive"
            ? req.query.status
            : undefined;

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest";

    const { departments, meta } = await getAllDepartmentsService({
        page,
        limit,
        search,
        status,
        sort,
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Departments fetched successfully.",
            departments,
            meta
        )
    );
});

/**
 * Get Department By ID
 */
export const getDepartment = asyncHandler(async (req, res) => {
    const department = await getDepartmentService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "Department fetched successfully.",
            department
        )
    );
});

/**
 * Update Department
 */
export const updateDepartment = asyncHandler(async (req, res) => {
    const department = await updateDepartmentService(
        req.params.id as string,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Department updated successfully.",
            department
        )
    );
});

/**
 * Delete Department
 */
export const deleteDepartment = asyncHandler(async (req, res) => {
    await deleteDepartmentService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "Department deleted successfully.",
            null
        )
    );
});