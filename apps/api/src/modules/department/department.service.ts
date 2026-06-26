import { CreateDepartmentInput } from "@attendance/shared-zod";
import { DepartmentModel } from "./department.model.js";
import { Types } from "mongoose";
import type { SortOrder } from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import { ClassModel } from "../class/class.model.js";
import { StatusCodes } from "http-status-codes";

export const addDepartmentService = async (
    data: CreateDepartmentInput
) => {
    const departmentExists = await DepartmentModel.findOne({
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (departmentExists) {
        if (departmentExists.name === data.name) {
            throw new ApiError(400, "Department name already exists.");
        }

        throw new ApiError(400, "Department code already exists.");
    }

    const department = await DepartmentModel.create(data);

    return department;
};

interface GetAllDepartmentsOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}

export const getAllDepartmentsService = async ({
    page = 1,
    limit = 10,
    search = "",
    status,
    sort = "newest",
}: GetAllDepartmentsOptions) => {
    const filter: Record<string, unknown> = {};

    if (search.trim()) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                code: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (status) {
        filter.status = status;
    }

    const sortOption: Record<string, SortOrder> =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
        DepartmentModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        DepartmentModel.countDocuments(filter),
    ]);

    return {
        departments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};

export const getDepartmentService = async (
    departmentId: string
) => {
    const department = await DepartmentModel.findById(
        new Types.ObjectId(departmentId)
    ).lean();

    if (!department)
        throw new ApiError(404, "Department not found")

    return department;
};

export const updateDepartmentService = async (
    departmentId: string,
    data: CreateDepartmentInput
) => {
    const department = await DepartmentModel.findById(departmentId);

    if (!department) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Department not found."
        );
    }

    const duplicateDepartment = await DepartmentModel.findOne({
        _id: { $ne: departmentId },
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (duplicateDepartment) {
        if (duplicateDepartment.name === data.name) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Department name already exists."
            );
        }

        throw new ApiError(
            StatusCodes.CONFLICT,
            "Department code already exists."
        );
    }

    Object.assign(department, data);

    await department.save();

    return department;
};

export const deleteDepartmentService = async (
    departmentId: string
) => {
    const classExists = await ClassModel.exists({
        department: departmentId,
    });

    if (classExists) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Cannot delete department because it is assigned to one or more classes."
        );
    }
    const department = await DepartmentModel.findByIdAndDelete(
        departmentId
    );

    if (!department) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Department not found."
        );
    }

    return department;
};