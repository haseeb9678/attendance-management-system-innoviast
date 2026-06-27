import { CreateSubjectInput } from "@attendance/shared-zod";
import { SubjectModel } from "./subject.model.js";
import { DepartmentModel } from "../department/department.model.js";
import { Types, type SortOrder } from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const addSubjectService = async (
    data: CreateSubjectInput
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

    const subjectExists = await SubjectModel.findOne({
        department: data.department,
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (subjectExists) {
        if (subjectExists.name === data.name) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Subject name already exists in this department."
            );
        }

        throw new ApiError(
            StatusCodes.CONFLICT,
            "Subject code already exists in this department."
        );
    }

    const subject = await SubjectModel.create(data);

    return subject;
};

interface GetAllSubjectsOptions {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}

export const getAllSubjectsService = async ({
    page = 1,
    limit = 10,
    search = "",
    department,
    status,
    sort = "newest",
}: GetAllSubjectsOptions) => {
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

    const [subjects, total] = await Promise.all([
        SubjectModel.find(filter)
            .populate("department", "name code")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        SubjectModel.countDocuments(filter),
    ]);

    return {
        subjects,
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

export const getSubjectService = async (
    subjectId: string
) => {
    const subject = await SubjectModel.findById(
        new Types.ObjectId(subjectId)
    )
        .populate("department", "name code")
        .lean();

    if (!subject) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject not found."
        );
    }

    return subject;
};

export const updateSubjectService = async (
    subjectId: string,
    data: CreateSubjectInput
) => {
    const subject = await SubjectModel.findById(subjectId);

    if (!subject) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject not found."
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

    const duplicateSubject = await SubjectModel.findOne({
        _id: { $ne: subjectId },
        department: data.department,
        $or: [
            { name: data.name },
            { code: data.code },
        ],
    });

    if (duplicateSubject) {
        if (duplicateSubject.name === data.name) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Subject name already exists in this department."
            );
        }

        throw new ApiError(
            StatusCodes.CONFLICT,
            "Subject code already exists in this department."
        );
    }

    Object.assign(subject, data);

    await subject.save();

    return subject;
};

export const deleteSubjectService = async (
    subjectId: string
) => {
    // Later you can check whether this subject
    // is assigned to teachers or sessions.

    const subject = await SubjectModel.findByIdAndDelete(
        subjectId
    );

    if (!subject) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject not found."
        );
    }

    return subject;
};