import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";

import { UserModel } from "../user/user.model.js";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { SessionModel } from "../session/session.model.js";
import { AttendanceModel } from "../attendance/attendance.model.js";

import { UpdateUserInput } from "@attendance/shared-zod";
import { USER_ROLE } from "@attendance/shared-types";

interface GetAttendanceHistoryOptions {
    studentId: string;
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    status?: "present" | "absent" | "late" | "excused";
    sort?: "newest" | "oldest";
}

/**
 * =========================================
 * STUDENT DASHBOARD
 * =========================================
 * Dashboard only contains:
 * - overview
 * - recent sessions
 */
export const getStudentDashboardService = async (
    studentId: string
) => {
    const student = await UserModel.findById(studentId)
        .populate("class", "name code status")
        .lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        return {
            overview: {
                className: null,
                classCode: null,
                totalSubjects: 0,
                totalSessions: 0,
            },
            recentSessions: [],
        };
    }

    const classId = (student.class as any)._id;

    /**
     * Active assignments for student's class
     */
    const assignments = await TeacherAssignmentModel.find({
        class: new Types.ObjectId(classId),
        status: "active",
    })
        .populate("subject", "name code creditHours")
        .populate("department", "name code")
        .lean();

    const assignmentIds = assignments.map(
        (assignment) => assignment._id
    );

    /**
     * All sessions of student's class
     */
    const sessions = await SessionModel.find({
        teacherAssignment: {
            $in: assignmentIds,
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
                {
                    path: "instructor",
                    select: "name email",
                },
            ],
        })
        .sort({
            date: -1,
            startTime: -1,
        })
        .lean();

    const recentSessions = sessions.slice(0, 5);

    return {
        overview: {
            className: (student.class as any).name,
            classCode: (student.class as any).code,
            totalSubjects: assignments.length,
            totalSessions: sessions.length,
        },
        recentSessions,
    };
};

/**
 * =========================================
 * MY CLASS
 * =========================================
 */
export const getMyClassService = async (
    studentId: string
) => {
    const student = await UserModel.findById(studentId)
        .populate("class", "name code description status")
        .lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "No class assigned to this student."
        );
    }

    const classId = (student.class as any)._id;

    const assignment = await TeacherAssignmentModel.findOne({
        class: new Types.ObjectId(classId),
        status: "active",
    })
        .populate("department", "name code")
        .lean();

    return {
        ...(student.class as any),
        department: assignment?.department ?? null,
    };
};

/**
 * =========================================
 * MY SUBJECTS
 * =========================================
 */
export const getMySubjectsService = async (
    studentId: string
) => {
    const student = await UserModel.findById(studentId).lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        return [];
    }

    return TeacherAssignmentModel.find({
        class: new Types.ObjectId(student.class),
        status: "active",
    })
        .populate("subject", "name code creditHours")
        .populate("department", "name code")
        .populate("instructor", "name email")
        .lean();
};

/**
 * =========================================
 * MY SESSIONS
 * =========================================
 */
export const getMySessionsService = async (
    studentId: string
) => {
    const student = await UserModel.findById(studentId).lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        return [];
    }

    const assignments = await TeacherAssignmentModel.find({
        class: new Types.ObjectId(student.class),
        status: "active",
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
                {
                    path: "instructor",
                    select: "name email",
                },
            ],
        })
        .sort({
            date: -1,
            startTime: -1,
        })
        .lean();
};


interface GetStudentAttendanceHistoryOptions {
    studentId: string;
    search?: string;
    sort?: "newest" | "oldest";
}

export const getMyAttendanceHistoryService = async ({
    studentId,
    search = "",
    sort = "newest",
}: GetStudentAttendanceHistoryOptions) => {
    const student = await UserModel.findById(studentId).lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        return [];
    }

    const pipeline: any[] = [
        /**
         * Student's class active assignments
         */
        {
            $match: {
                class: new Types.ObjectId(student.class),
                status: "active",
            },
        },

        /**
         * Subject
         */
        {
            $lookup: {
                from: "subjects",
                localField: "subject",
                foreignField: "_id",
                as: "subject",
            },
        },
        {
            $unwind: "$subject",
        },

        /**
         * Department
         */
        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department",
            },
        },
        {
            $unwind: "$department",
        },

        /**
         * Instructor
         */
        {
            $lookup: {
                from: "users",
                localField: "instructor",
                foreignField: "_id",
                as: "instructor",
            },
        },
        {
            $unwind: "$instructor",
        },
    ];

    /**
     * Search by subject name / code
     */
    if (search.trim()) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        "subject.name": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        "subject.code": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            },
        });
    }

    /**
     * Sessions of this assignment / subject
     */
    pipeline.push({
        $lookup: {
            from: "sessions",
            let: { assignmentId: "$_id" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                "$teacherAssignment",
                                "$$assignmentId",
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                    },
                },
            ],
            as: "sessions",
        },
    });

    /**
     * Student attendance of this subject's sessions
     */
    pipeline.push({
        $lookup: {
            from: "attendances",
            let: {
                sessionIds: "$sessions._id",
            },
            pipeline: [
                {
                    $match: {
                        student: new Types.ObjectId(studentId),
                        $expr: {
                            $in: ["$session", "$$sessionIds"],
                        },
                    },
                },
            ],
            as: "myAttendance",
        },
    });

    /**
     * Stats
     */
    pipeline.push({
        $addFields: {
            totalSessions: {
                $size: "$sessions",
            },

            totalPresents: {
                $size: {
                    $filter: {
                        input: "$myAttendance",
                        as: "attendance",
                        cond: {
                            $eq: [
                                "$$attendance.status",
                                "present",
                            ],
                        },
                    },
                },
            },
        },
    });

    pipeline.push({
        $addFields: {
            attendancePercentage: {
                $cond: [
                    {
                        $gt: ["$totalSessions", 0],
                    },
                    {
                        $round: [
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalPresents",
                                            "$totalSessions",
                                        ],
                                    },
                                    100,
                                ],
                            },
                            1,
                        ],
                    },
                    0,
                ],
            },
        },
    });

    /**
     * Final response shape
     */
    pipeline.push({
        $project: {
            _id: 0,

            teacherAssignmentId: "$_id",

            subject: {
                _id: "$subject._id",
                name: "$subject.name",
                code: "$subject.code",
                creditHours: "$subject.creditHours",
            },

            department: {
                _id: "$department._id",
                name: "$department.name",
                code: "$department.code",
            },

            instructor: {
                _id: "$instructor._id",
                name: "$instructor.name",
                email: "$instructor.email",
            },

            totalSessions: 1,
            totalPresents: 1,
            attendancePercentage: 1,
        },
    });

    /**
     * Sorting
     */
    pipeline.push({
        $sort:
            sort === "oldest"
                ? { "subject.name": 1 }
                : { "subject.name": -1 },
    });

    return TeacherAssignmentModel.aggregate(pipeline);
};

interface GetStudentAttendanceSubjectDetailsOptions {
    studentId: string;
    subjectId: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: "newest" | "oldest";
}

export const getStudentAttendanceSubjectDetailsService = async ({
    studentId,
    subjectId,
    page = 1,
    limit = 10,
    search = "",
    sort = "newest",
}: GetStudentAttendanceSubjectDetailsOptions) => {
    const student = await UserModel.findById(studentId).lean();

    if (!student || student.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!student.class) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "No class assigned to this student."
        );
    }

    const assignment = await TeacherAssignmentModel.findOne({
        class: new Types.ObjectId(student.class),
        subject: new Types.ObjectId(subjectId),
        status: "active",
    })
        .populate("subject", "name code creditHours")
        .populate("department", "name code")
        .populate("instructor", "name email")
        .lean();

    if (!assignment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Subject attendance record not found."
        );
    }

    const assignmentId = new Types.ObjectId(
        assignment._id
    );

    const studentObjectId =
        new Types.ObjectId(studentId);

    const skip = (page - 1) * limit;

    /**
     * -----------------------------
     * 1) Subject attendance stats
     * -----------------------------
     */
    const statsPipeline: any[] = [
        {
            $match: {
                teacherAssignment: assignmentId,
            },
        },

        {
            $lookup: {
                from: "attendances",
                let: { sessionId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            student: studentObjectId,
                            $expr: {
                                $eq: [
                                    "$session",
                                    "$$sessionId",
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            status: 1,
                        },
                    },
                ],
                as: "myAttendance",
            },
        },

        {
            $addFields: {
                attendanceStatus: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$myAttendance.status",
                                0,
                            ],
                        },
                        "not_marked",
                    ],
                },
            },
        },

        {
            $group: {
                _id: null,

                totalSessions: {
                    $sum: 1,
                },

                present: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "present",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                absent: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "absent",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                late: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "late",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                excused: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "excused",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                notMarked: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "not_marked",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },

        {
            $addFields: {
                attendancePercentage: {
                    $cond: [
                        {
                            $gt: [
                                "$totalSessions",
                                0,
                            ],
                        },
                        {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$present",
                                                "$totalSessions",
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                1,
                            ],
                        },
                        0,
                    ],
                },
            },
        },

        {
            $project: {
                _id: 0,
                totalSessions: 1,
                present: 1,
                absent: 1,
                late: 1,
                excused: 1,
                notMarked: 1,
                attendancePercentage: 1,
            },
        },
    ];

    /**
     * ------------------------------------
     * 2) Paginated session details table
     * ------------------------------------
     */
    const sessionsPipeline: any[] = [
        {
            $match: {
                teacherAssignment: assignmentId,
            },
        },
    ];

    /**
     * Search by room
     */
    if (search.trim()) {
        sessionsPipeline.push({
            $match: {
                room: {
                    $regex: search,
                    $options: "i",
                },
            },
        });
    }

    /**
     * My attendance for each session
     */
    sessionsPipeline.push({
        $lookup: {
            from: "attendances",
            let: { sessionId: "$_id" },
            pipeline: [
                {
                    $match: {
                        student: studentObjectId,
                        $expr: {
                            $eq: [
                                "$session",
                                "$$sessionId",
                            ],
                        },
                    },
                },
                {
                    $project: {
                        status: 1,
                    },
                },
            ],
            as: "myAttendance",
        },
    });

    sessionsPipeline.push({
        $addFields: {
            attendanceStatus: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            "$myAttendance.status",
                            0,
                        ],
                    },
                    "not_marked",
                ],
            },
        },
    });

    sessionsPipeline.push({
        $project: {
            _id: 1,
            room: 1,
            date: 1,
            startTime: 1,
            endTime: 1,
            status: 1,
            attendanceStatus: 1,
        },
    });

    sessionsPipeline.push({
        $sort:
            sort === "oldest"
                ? {
                    date: 1,
                    startTime: 1,
                }
                : {
                    date: -1,
                    startTime: -1,
                },
    });

    sessionsPipeline.push({
        $facet: {
            data: [
                { $skip: skip },
                { $limit: limit },
            ],
            total: [{ $count: "count" }],
        },
    });

    const [statsResult, sessionsResult] =
        await Promise.all([
            SessionModel.aggregate(statsPipeline),
            SessionModel.aggregate(sessionsPipeline),
        ]);

    const stats = statsResult[0] ?? {
        totalSessions: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        notMarked: 0,
        attendancePercentage: 0,
    };

    const sessions =
        sessionsResult[0]?.data ?? [];
    const total =
        sessionsResult[0]?.total?.[0]?.count ?? 0;

    return {
        subject: assignment.subject,
        department: assignment.department,
        instructor: assignment.instructor,

        stats,
        sessions,

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

/**
 * =========================================
 * UPDATE STUDENT PROFILE
 * =========================================
 */
export const updateStudentProfileService = async (
    studentId: string,
    data: UpdateUserInput
) => {
    const user = await UserModel.findById(studentId).select(
        "+password"
    );

    if (!user || user.role !== USER_ROLE.STUDENT) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Student not found."
        );
    }

    if (!data.currentPassword) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Current password is required."
        );
    }

    const isMatched = await user.comparePassword(
        data.currentPassword
    );

    if (!isMatched) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Invalid password."
        );
    }

    const result = await UserModel.findByIdAndUpdate(
        studentId,
        {
            name: data.name,
            phoneNumber: data.phoneNumber,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return {
        _id: result?._id,
        name: result?.name,
        email: result?.email,
        phoneNumber: result?.phoneNumber,
        role: result?.role,
    };
};