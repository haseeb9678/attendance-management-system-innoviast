import mongoose, { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

import { CreateAttendanceInput } from "@attendance/shared-zod";

import ApiError from "../../shared/utils/ApiError.js";

import { AttendanceModel } from "./attendance.model.js";
import { SessionModel } from "../session/session.model.js";
import { TeacherAssignmentDocument } from "../teacherAssignment/teacherAssignment.model.js";
import { UserModel } from "../user/user.model.js";



export const createAttendanceService = async (
    instructorId: string,
    data: CreateAttendanceInput
) => {
    const mongoSession = await mongoose.startSession();

    try {
        mongoSession.startTransaction();

        const session = await SessionModel.findById(data.session)
            .populate<{
                teacherAssignment: TeacherAssignmentDocument;
            }>("teacherAssignment")
            .session(mongoSession);

        if (!session) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Session not found."
            );
        }

        if (
            session.teacherAssignment.instructor.toString() !==
            instructorId
        ) {
            throw new ApiError(
                StatusCodes.FORBIDDEN,
                "You are not assigned to this session."
            );
        }

        const [students, attendanceExists] =
            await Promise.all([
                UserModel.find({
                    _id: {
                        $in: data.students.map(
                            (student) =>
                                new Types.ObjectId(
                                    student.student
                                )
                        ),
                    },
                    class:
                        session.teacherAssignment.class,
                })
                    .select("_id")
                    .session(mongoSession),

                AttendanceModel.exists({
                    session: session._id,
                }).session(mongoSession),
            ]);

        if (
            students.length !==
            data.students.length
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "One or more students do not belong to this class."
            );
        }

        if (attendanceExists) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Attendance has already been marked for this session."
            );
        }

        const attendance =
            await AttendanceModel.insertMany(
                data.students.map((student) => ({
                    session: session._id,
                    student: student.student,
                    status: student.status,
                    remarks: student.remarks,
                    markedAt: new Date(),
                })),
                {
                    session: mongoSession,
                }
            );

        await mongoSession.commitTransaction();

        return attendance;
    } catch (error) {
        await mongoSession.abortTransaction();
        throw error;
    } finally {
        mongoSession.endSession();
    }
};

export const getSessionAttendanceService = async (
    instructorId: string,
    sessionId: string
) => {
    const session = await SessionModel.findById(sessionId)
        .populate<{
            teacherAssignment: TeacherAssignmentDocument;
        }>("teacherAssignment");

    if (!session) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Session not found."
        );
    }

    if (
        session.teacherAssignment.instructor.toString() !==
        instructorId
    ) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not assigned to this session."
        );
    }

    return AttendanceModel.find({
        session: new Types.ObjectId(sessionId),
    })
        .populate(
            "student",
            "name rollNumber registrationNumber"
        )
        .sort({
            "student.rollNumber": 1,
        })
        .lean();
};


export const updateAttendanceService = async (
    instructorId: string,
    sessionId: string,
    data: CreateAttendanceInput
) => {
    const mongoSession = await mongoose.startSession();

    try {
        mongoSession.startTransaction();

        const session = await SessionModel.findById(sessionId)
            .populate<{
                teacherAssignment: TeacherAssignmentDocument;
            }>("teacherAssignment")
            .session(mongoSession);

        if (!session) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Session not found."
            );
        }

        if (
            session.teacherAssignment.instructor.toString() !==
            instructorId
        ) {
            throw new ApiError(
                StatusCodes.FORBIDDEN,
                "You are not assigned to this session."
            );
        }

        /**
         * Validate all submitted students belong
         * to this session's class.
         */
        const students = await UserModel.find({
            _id: {
                $in: data.students.map(
                    (student) =>
                        new Types.ObjectId(student.student)
                ),
            },
            class: session.teacherAssignment.class,
        })
            .select("_id")
            .session(mongoSession);

        if (
            students.length !==
            data.students.length
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "One or more students do not belong to this class."
            );
        }

        /**
         * Remove previous attendance.
         *
         * If attendance does not exist yet,
         * deleteMany simply deletes 0 documents,
         * which is perfectly fine.
         */
        await AttendanceModel.deleteMany(
            {
                session: session._id,
            },
            {
                session: mongoSession,
            }
        );

        /**
         * Insert latest attendance.
         */
        const attendance =
            await AttendanceModel.insertMany(
                data.students.map((student) => ({
                    session: session._id,
                    student: student.student,
                    status: student.status,
                    remarks: student.remarks,
                    markedAt: new Date(),
                })),
                {
                    session: mongoSession,
                }
            );

        await mongoSession.commitTransaction();

        return attendance;
    } catch (error) {
        await mongoSession.abortTransaction();
        throw error;
    } finally {
        await mongoSession.endSession();
    }
};

export const deleteAttendanceService = async (
    instructorId: string,
    sessionId: string
) => {
    const session = await SessionModel.findById(sessionId)
        .populate<{
            teacherAssignment: TeacherAssignmentDocument;
        }>("teacherAssignment");

    if (!session) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Session not found."
        );
    }

    if (
        session.teacherAssignment.instructor.toString() !==
        instructorId
    ) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not assigned to this session."
        );
    }

    await AttendanceModel.deleteMany({
        session: session._id,
    });

    return null;
};

export const getStudentAttendanceService = async (
    studentId: string
) => {
    return AttendanceModel.find({
        student: new Types.ObjectId(studentId),
    })
        .populate({
            path: "session",
            select: "date startTime endTime room",
            populate: {
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
            },
        })
        .sort({
            markedAt: -1,
        })
        .lean();
};