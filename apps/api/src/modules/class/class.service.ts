import { CreateClassInput } from "@attendance/shared-zod";
import { ClassModel } from "./class.model.js";
import { DepartmentModel } from "../department/department.model.js";
import { SubjectModel } from "../subject/subject.model.js";
import { Types, type SortOrder } from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const addClassService = async (
    data: CreateClassInput
) => {
    const departmentExists = await DepartmentModel.exists({
        _id: data.department,
    });

    if (!departmentExists) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Department not found."
        );
    }

    const classExists = await ClassModel.findOne({
        department: data.department,
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (classExists) {
        if (classExists.name === data.name) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Class name already exists in this department."
            );
        }

        throw new ApiError(
            StatusCodes.CONFLICT,
            "Class code already exists in this department."
        );
    }

    const newClass = await ClassModel.create(data);

    return newClass;
};

interface GetAllClassesOptions {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}

export const getAllClassesService = async ({
    page = 1,
    limit = 10,
    search = "",
    department,
    status,
    sort = "newest",
}: GetAllClassesOptions) => {
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

    if (department) {
        filter.department = new Types.ObjectId(department);
    }

    if (status) {
        filter.status = status;
    }

    const sortOption: Record<string, SortOrder> =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
        ClassModel.find(filter)
            .populate("department", "name code")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        ClassModel.countDocuments(filter),
    ]);

    return {
        classes,
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

export const getClassService = async (
    classId: string
) => {
    const classData = await ClassModel.findById(
        new Types.ObjectId(classId)
    )
        .populate("department", "name code")
        .lean();

    if (!classData) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Class not found."
        );
    }

    return classData;
};

export const updateClassService = async (
    classId: string,
    data: CreateClassInput
) => {
    const classData = await ClassModel.findById(classId);

    if (!classData) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Class not found."
        );
    }

    const departmentExists = await DepartmentModel.exists({
        _id: data.department,
    });

    if (!departmentExists) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Department not found."
        );
    }

    const duplicateClass = await ClassModel.findOne({
        _id: { $ne: classId },
        department: data.department,
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (duplicateClass) {
        if (duplicateClass.name === data.name) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Class name already exists in this department."
            );
        }

        throw new ApiError(
            StatusCodes.CONFLICT,
            "Class code already exists in this department."
        );
    }

    Object.assign(classData, data);

    await classData.save();

    return classData;
};

export const deleteClassService = async (
    classId: string
) => {
    const subjectExists = await SubjectModel.exists({
        class: classId,
    });

    if (subjectExists) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Cannot delete class because it is assigned to one or more subjects."
        );
    }

    const classData = await ClassModel.findByIdAndDelete(
        classId
    );

    if (!classData) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Class not found."
        );
    }

    return classData;
};