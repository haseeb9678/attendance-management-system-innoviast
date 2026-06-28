import { Types } from "mongoose";

import { SessionModel } from "../session/session.model.js";

import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { USER_ROLE } from "@attendance/shared-types";
import { UserModel } from "../user/user.model.js";


export const getMyClassesService = async (
    instructorId: string
) => {

    const assignments =
        await TeacherAssignmentModel.find({
            instructor: new Types.ObjectId(instructorId),
        })
            .populate("class", "name code status")
            .populate("department", "name code")
            .lean();

    return Array.from(
        new Map(
            assignments.map((assignment) => [
                assignment.class._id.toString(),
                {
                    ...assignment.class,
                    department: assignment.department,
                },
            ])
        ).values()
    );
};

export const getMySubjectsService = async (
    instructorId: string
) => {
    return TeacherAssignmentModel.find({
        instructor: new Types.ObjectId(instructorId),
    })
        .populate("subject", "name code creditHours")
        .populate("class", "name code")
        .populate("department", "name code")
        .lean();
};


export const getMySessionsService = async (
    instructorId: string
) => {
    const assignments = await TeacherAssignmentModel.find({
        instructor: new Types.ObjectId(instructorId),
    }).select("_id");

    return SessionModel.find({
        teacherAssignment: {
            $in: assignments.map((a) => a._id),
        },
    })
        .populate({
            path: "teacherAssignment",
            populate: [
                {
                    path: "subject",
                    select: "name code",
                },
                {
                    path: "class",
                    select: "name code",
                },
                {
                    path: "department",
                    select: "name code",
                },
            ],
        })
        .sort({
            date: 1,
            startTime: 1,
        })
        .lean();
};



export const getMyStudentsService = async (
    instructorId: string,
    classId: string
) => {
    const assignment = await TeacherAssignmentModel.exists({
        instructor: new Types.ObjectId(instructorId),
        class: new Types.ObjectId(classId),
    });

    if (!assignment) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not assigned to this class."
        );
    }

    return UserModel.find({
        role: USER_ROLE.STUDENT,
        class: new Types.ObjectId(classId),
    })
        .select(
            "name registrationNumber rollNumber email phoneNumber"
        )
        .sort({
            rollNumber: 1,
        })
        .lean();
};