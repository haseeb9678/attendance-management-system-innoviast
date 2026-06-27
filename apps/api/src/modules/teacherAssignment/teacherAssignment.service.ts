import { CreateTeacherAssignmentInput } from "@attendance/shared-zod";
import { TeacherAssignmentModel } from "./teacherAssignment.model.js";
import { UserModel } from "../users/user.model.js";
import { ClassModel } from "../class/class.model.js";
import { SubjectModel } from "../subject/subject.model.js";
import { Types, type SortOrder } from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const addTeacherAssignmentService = async (
    data: CreateTeacherAssignmentInput
) => {
    const [instructor, classItem, subject] = await Promise.all([
        UserModel.findById(data.instructor),
        ClassModel.findById(data.class),
        SubjectModel.findById(data.subject),
    ]);

    if (!instructor || instructor.role !== "instructor") {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Instructor not found."
        );
    }

    if (!classItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Class not found."
        );
    }

    if (!subject) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject not found."
        );
    }

    if (
        instructor.department?.toString() !==
        classItem.department.toString() ||
        subject.department.toString() !==
        classItem.department.toString()
    ) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Instructor, class and subject must belong to the same department."
        );
    }

    const assignmentExists =
        await TeacherAssignmentModel.findOne({
            class: data.class,
            subject: data.subject,
        });

    if (assignmentExists) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "This subject is already assigned to a instructor for this class."
        );
    }

    return TeacherAssignmentModel.create({
        ...data,
        department: classItem.department,
    });
};

interface GetAllTeacherAssignmentsOptions {
    page?: number;
    limit?: number;
    search?: string;
    instructor?: string;
    class?: string;
    department?: string;
    subject?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}

export const getAllTeacherAssignmentsService = async ({
    page = 1,
    limit = 10,
    search = "",
    instructor,
    class: classId,
    subject,
    department,
    status,
    sort = "newest",
}: GetAllTeacherAssignmentsOptions) => {
    const filter: Record<string, unknown> = {};

    if (instructor) {
        filter.instructor = new Types.ObjectId(instructor);
    }

    if (classId) {
        filter.class = new Types.ObjectId(classId);
    }

    if (subject) {
        filter.subject = new Types.ObjectId(subject);
    }

    if (status) {
        filter.status = status;
    }
    if (department) {
        filter.department = new Types.ObjectId(department);
    }

    if (search.trim()) {
        const instructors = await UserModel.find({
            role: "instructor",
            name: {
                $regex: search,
                $options: "i",
            },
        }).select("_id");

        filter.instructor = {
            $in: instructors.map((instructor) => instructor._id),
        };
    }

    const sortOption: Record<string, SortOrder> =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [teacherAssignments, total] = await Promise.all([
        TeacherAssignmentModel.find(filter)
            .populate(
                "instructor",
                "name email employeeId"
            )
            .populate("department", "name code")
            .populate(
                "class",
                "name code"
            )
            .populate(
                "subject",
                "name code"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        TeacherAssignmentModel.countDocuments(filter),
    ]);

    return {
        teacherAssignments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage:
                page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};

export const getTeacherAssignmentService = async (
    assignmentId: string
) => {
    const assignment =
        await TeacherAssignmentModel.findById(
            new Types.ObjectId(assignmentId)
        )
            .populate(
                "instructor",
                "name email employeeId"
            )
            .populate("department", "name code")
            .populate(
                "class",
                "name code"
            )
            .populate(
                "subject",
                "name code"
            )
            .lean();

    if (!assignment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Teacher assignment not found."
        );
    }

    return assignment;
};

export const updateTeacherAssignmentService = async (
    assignmentId: string,
    data: CreateTeacherAssignmentInput
) => {
    const assignment =
        await TeacherAssignmentModel.findById(
            assignmentId
        );

    if (!assignment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Teacher assignment not found."
        );
    }

    const [instructor, classItem, subject] =
        await Promise.all([
            UserModel.findById(data.instructor),
            ClassModel.findById(data.class),
            SubjectModel.findById(data.subject),
        ]);

    if (!instructor || instructor.role !== "instructor") {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Instructor not found."
        );
    }

    if (!classItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Class not found."
        );
    }

    if (!subject) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject not found."
        );
    }

    if (
        instructor.department?.toString() !==
        classItem.department.toString() ||
        subject.department.toString() !==
        classItem.department.toString()
    ) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Instructor, class and subject must belong to the same department."
        );
    }

    const duplicate =
        await TeacherAssignmentModel.findOne({
            _id: { $ne: assignmentId },
            class: data.class,
            subject: data.subject,
        });

    if (duplicate) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "This subject is already assigned to a instructor for this class."
        );
    }

    Object.assign(assignment, {
        ...data,
        department: classItem.department,
    });

    await assignment.save();

    return assignment;
};

export const deleteTeacherAssignmentService = async (
    assignmentId: string
) => {
    // Later:
    // Check if this assignment is used in Session.

    const assignment =
        await TeacherAssignmentModel.findByIdAndDelete(
            assignmentId
        );

    if (!assignment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Teacher assignment not found."
        );
    }

    return assignment;
};