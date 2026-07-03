import { CreateUserInput } from "@attendance/shared-zod";
import { UserModel } from "./user.model.js";
import { DepartmentModel } from "../department/department.model.js";
import { ClassModel } from "../class/class.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { SortOrder, Types } from "mongoose";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";

export const addUserService = async (
    data: CreateUserInput
) => {

    if (!data.registrationNumber) {
        delete data.registrationNumber;
    }

    if (!data.rollNumber) {
        delete data.rollNumber;
    }

    if (!data.employeeId) {
        delete data.employeeId;
    }

    if (!data.class) {
        delete data.class;
    }

    if (!data.department) {
        delete data.department;
    }
    const duplicateUser = await UserModel.findOne({
        $or: [
            { email: data.email },
            { phoneNumber: data.phoneNumber },
            ...(data.registrationNumber
                ? [{ registrationNumber: data.registrationNumber }]
                : []),
            ...(data.employeeId
                ? [{ employeeId: data.employeeId }]
                : []),
        ],
    });

    if (duplicateUser) {
        if (duplicateUser.email === data.email) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Email already exists."
            );
        }

        if (duplicateUser.phoneNumber === data.phoneNumber) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Phone number already exists."
            );
        }

        if (
            data.registrationNumber &&
            duplicateUser.registrationNumber === data.registrationNumber
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Registration number already exists."
            );
        }

        if (
            data.employeeId &&
            duplicateUser.employeeId === data.employeeId
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Employee ID already exists."
            );
        }
    }

    if (data.department) {
        const departmentExists = await DepartmentModel.exists({
            _id: data.department,
        });

        if (!departmentExists) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Department not found."
            );
        }
    }

    if (data.class) {
        const classExists = await ClassModel.exists({
            _id: data.class,
        });

        if (!classExists) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Class not found."
            );
        }
    }

    if (data.role === "student") {
        const rollExists = await UserModel.exists({
            class: data.class,
            rollNumber: data.rollNumber,
        });

        if (rollExists) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Roll number already exists in this class."
            );
        }
    }

    const user = await UserModel.create(data);

    return user;
};

interface GetAllUsersOptions {
    page?: number;
    limit?: number;
    search?: string;
    role?: "admin" | "instructor" | "student";
    department?: string;
    class?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}

export const getAllUsersService = async ({
    page = 1,
    limit = 10,
    search = "",
    role,
    department,
    class: classId,
    status,
    sort = "newest",
}: GetAllUsersOptions) => {
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
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                registrationNumber: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                employeeId: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (role) filter.role = role;

    if (status) filter.status = status;

    if (department) {
        filter.department = new Types.ObjectId(department);
    }

    if (classId) {
        filter.class = new Types.ObjectId(classId);
    }

    const sortOption: Record<string, SortOrder> =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        UserModel.find(filter)
            .populate("department", "name code")
            .populate("class", "name code")
            .select("-password -refreshTokenHash")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),

        UserModel.countDocuments(filter),
    ]);

    return {
        users,
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

export const getUserService = async (
    userId: string
) => {
    const user = await UserModel.findById(
        new Types.ObjectId(userId)
    )
        .populate("department", "name code")
        .populate("class", "name code")
        .select("-password -refreshTokenHash")
        .lean();

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "User not found."
        );
    }

    return user;
};

export const updateUserService = async (
    userId: string,
    data: CreateUserInput
) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "User not found."
        );
    }

    const duplicateUser = await UserModel.findOne({
        _id: { $ne: userId },
        $or: [
            { email: data.email },
            { phoneNumber: data.phoneNumber },
            ...(data.registrationNumber
                ? [
                    {
                        registrationNumber:
                            data.registrationNumber,
                    },
                ]
                : []),
            ...(data.employeeId
                ? [
                    {
                        employeeId: data.employeeId,
                    },
                ]
                : []),
        ],
    });

    if (duplicateUser) {
        if (duplicateUser.email === data.email) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Email already exists."
            );
        }

        if (
            duplicateUser.phoneNumber ===
            data.phoneNumber
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Phone number already exists."
            );
        }

        if (
            data.registrationNumber &&
            duplicateUser.registrationNumber ===
            data.registrationNumber
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Registration number already exists."
            );
        }

        if (
            data.employeeId &&
            duplicateUser.employeeId ===
            data.employeeId
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Employee ID already exists."
            );
        }
    }

    if (data.department) {
        const departmentExists =
            await DepartmentModel.exists({
                _id: data.department,
            });

        if (!departmentExists) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Department not found."
            );
        }
    }

    if (data.class) {
        const classExists =
            await ClassModel.exists({
                _id: data.class,
            });

        if (!classExists) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Class not found."
            );
        }
    }

    if (
        data.role === "student" &&
        data.rollNumber &&
        data.class
    ) {
        const rollExists =
            await UserModel.findOne({
                _id: { $ne: userId },
                class: data.class,
                rollNumber: data.rollNumber,
            });

        if (rollExists) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Roll number already exists in this class."
            );
        }
    }

    Object.assign(user, data);

    await user.save();

    return user;
};

interface UpdatePasswordOptions {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export const updatePasswordService = async ({
    userId,
    currentPassword,
    newPassword,
}: UpdatePasswordOptions) => {
    const user = await UserModel.findById(
        new Types.ObjectId(userId)
    ).select("+password");

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "User not found."
        );
    }

    const isPasswordCorrect =
        await user.comparePassword(
            currentPassword
        );

    if (!isPasswordCorrect) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Current password is incorrect."
        );
    }

    const isSamePassword =
        await user.comparePassword(
            newPassword
        );

    if (isSamePassword) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "New password must be different from the current password."
        );
    }

    user.password = newPassword;

    await user.save();

    return null;
};


export const deleteUserService = async (
    userId: string
) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "User not found."
        );
    }

    /**
     * Prevent deleting the last admin.
     */
    if (user.role === "admin") {
        const adminCount = await UserModel.countDocuments({
            role: "admin",
        });

        if (adminCount === 1) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Cannot delete the last administrator."
            );
        }
    }

    /**
     * Prevent deleting instructors
     * that are assigned to classes.
     */
    if (user.role === "instructor") {
        const assignmentExists =
            await TeacherAssignmentModel.exists({
                instructor: user._id,
            });

        if (assignmentExists) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Cannot delete instructor because they are assigned to one or more classes."
            );
        }
    }

    await user.deleteOne();

    return user;
};