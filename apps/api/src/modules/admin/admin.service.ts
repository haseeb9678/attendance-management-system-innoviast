
import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import type { PipelineStage } from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";

import { SessionModel } from "../session/session.model.js";
import { AttendanceModel } from "../attendance/attendance.model.js";
import { USER_ROLE } from "@attendance/shared-types";

import { UserModel } from "../user/user.model.js";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { DepartmentModel } from "../department/department.model.js";
import { ClassModel } from "../class/class.model.js";
import { SubjectModel } from "../subject/subject.model.js";
import { UpdateUserInput, AdminUpdateUserInput } from "@attendance/shared-zod";

export const adminUpdateUserService = async (
    data: AdminUpdateUserInput
) => {
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Invalid user ID."
        );
    }

    const user = await UserModel.findById(data.id);

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "User not found."
        );
    }

    user.name = data.name.trim();
    user.phoneNumber = data.phoneNumber.trim();
    user.status = data.status;

    await user.save();

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
    };
};
export const getAdminDashboardStatsService = async () => {
    try {
        const [
            /**
             * Overview counts
             */
            totalUsers,
            totalStudents,
            totalInstructors,
            totalAdmins,
            totalDepartments,
            totalClasses,
            totalSubjects,
            totalTeacherAssignments,

            /**
             * Session counts
             */
            totalSessions,
            scheduledSessions,
            ongoingSessions,
            completedSessions,
            cancelledSessions,

            /**
             * Attendance counts
             */
            totalAttendanceRecords,
            present,
            absent,
            late,
            excused,

            /**
             * Recent activity
             */
            recentUsers,
            recentSessions,
            recentTeacherAssignments,

            /**
             * Monthly attendance trend
             */
            monthlyAttendanceTrendRaw,
        ] = await Promise.all([
            /**
             * Users
             */
            UserModel.countDocuments(),
            UserModel.countDocuments({
                role: USER_ROLE.STUDENT,
            }),
            UserModel.countDocuments({
                role: USER_ROLE.INSTRUCTOR,
            }),
            UserModel.countDocuments({
                role: USER_ROLE.ADMIN,
            }),

            /**
             * Academic entities
             */
            DepartmentModel.countDocuments(),
            ClassModel.countDocuments(),
            SubjectModel.countDocuments(),
            TeacherAssignmentModel.countDocuments(),

            /**
             * Sessions
             */
            SessionModel.countDocuments(),
            SessionModel.countDocuments({
                status: "scheduled",
            }),
            SessionModel.countDocuments({
                status: "ongoing",
            }),
            SessionModel.countDocuments({
                status: "completed",
            }),
            SessionModel.countDocuments({
                status: "cancelled",
            }),

            /**
             * Attendance
             */
            AttendanceModel.countDocuments(),
            AttendanceModel.countDocuments({
                status: "present",
            }),
            AttendanceModel.countDocuments({
                status: "absent",
            }),
            AttendanceModel.countDocuments({
                status: "late",
            }),
            AttendanceModel.countDocuments({
                status: "excused",
            }),

            /**
             * Recent users
             */
            UserModel.find()
                .select("name email role status createdAt")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            /**
             * Recent sessions
             */
            SessionModel.find()
                .populate({
                    path: "teacherAssignment",
                    select: "subject class instructor",
                    populate: [
                        {
                            path: "subject",
                            select: "name code",
                        },
                        {
                            path: "class",
                            select: "name section semester",
                        },
                        {
                            path: "instructor",
                            select: "name email",
                        },
                    ],
                })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            /**
             * Recent teacher assignments
             */
            TeacherAssignmentModel.find()
                .populate("subject", "name code")
                .populate("class", "name section semester")
                .populate("instructor", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            /**
             * Monthly attendance trend for charts
             * Last 12 months grouped by month + status
             */
            AttendanceModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() - 11,
                                1
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt",
                            },
                            month: {
                                $month: "$createdAt",
                            },
                            status: "$status",
                        },
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    },
                },
            ]),
        ]);

        /**
         * Attendance rates
         */
        const presentRate =
            totalAttendanceRecords > 0
                ? Number(
                    (
                        (present / totalAttendanceRecords) *
                        100
                    ).toFixed(2)
                )
                : 0;

        const absentRate =
            totalAttendanceRecords > 0
                ? Number(
                    (
                        (absent / totalAttendanceRecords) *
                        100
                    ).toFixed(2)
                )
                : 0;

        const lateRate =
            totalAttendanceRecords > 0
                ? Number(
                    (
                        (late / totalAttendanceRecords) *
                        100
                    ).toFixed(2)
                )
                : 0;

        const excusedRate =
            totalAttendanceRecords > 0
                ? Number(
                    (
                        (excused / totalAttendanceRecords) *
                        100
                    ).toFixed(2)
                )
                : 0;

        /**
         * Convert monthly attendance aggregation
         * into chart-ready format
         */
        const monthMap = new Map<
            string,
            {
                month: string;
                present: number;
                absent: number;
                late: number;
                excused: number;
            }
        >();

        for (const item of monthlyAttendanceTrendRaw) {
            const year = item._id.year;
            const month = item._id.month;
            const status = item._id.status;
            const total = item.total;

            const date = new Date(year, month - 1);
            const monthLabel = date.toLocaleString("default", {
                month: "short",
            });

            if (!monthMap.has(`${year}-${month}`)) {
                monthMap.set(`${year}-${month}`, {
                    month: monthLabel,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                });
            }

            const current = monthMap.get(`${year}-${month}`)!;

            if (status === "present") current.present = total;
            if (status === "absent") current.absent = total;
            if (status === "late") current.late = total;
            if (status === "excused") current.excused = total;
        }

        const monthlyAttendanceTrend = Array.from(
            monthMap.values()
        );

        return {
            overview: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalAdmins,
                totalDepartments,
                totalClasses,
                totalSubjects,
                totalTeacherAssignments,
            },

            sessions: {
                totalSessions,
                scheduledSessions,
                ongoingSessions,
                completedSessions,
                cancelledSessions,
            },

            attendance: {
                totalAttendanceRecords,
                present,
                absent,
                late,
                excused,
                presentRate,
                absentRate,
                lateRate,
                excusedRate,
            },

            charts: {
                attendanceDistribution: [
                    {
                        name: "Present",
                        value: present,
                    },
                    {
                        name: "Absent",
                        value: absent,
                    },
                    {
                        name: "Late",
                        value: late,
                    },
                    {
                        name: "Excused",
                        value: excused,
                    },
                ],

                sessionStatusDistribution: [
                    {
                        name: "Scheduled",
                        value: scheduledSessions,
                    },
                    {
                        name: "Ongoing",
                        value: ongoingSessions,
                    },
                    {
                        name: "Completed",
                        value: completedSessions,
                    },
                    {
                        name: "Cancelled",
                        value: cancelledSessions,
                    },
                ],

                userRoleDistribution: [
                    {
                        name: "Students",
                        value: totalStudents,
                    },
                    {
                        name: "Instructors",
                        value: totalInstructors,
                    },
                    {
                        name: "Admins",
                        value: totalAdmins,
                    },
                ],

                monthlyAttendanceTrend,
            },

            recent: {
                users: recentUsers,
                sessions: recentSessions,
                teacherAssignments:
                    recentTeacherAssignments,
            },
        };
    } catch (error) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to fetch admin dashboard statistics"
        );
    }
};

export const updateAdminProfileService = async (
    adminId: string,
    data: UpdateUserInput
) => {
    const user = await UserModel.findById(adminId).select('+password');

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Instructor not found.");
    }

    if (!data.currentPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Current password is required.");
    }

    const isMatched = await user.comparePassword(data.currentPassword);

    if (!isMatched) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid password.");
    }

    const result = await UserModel.findByIdAndUpdate(
        adminId,
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

/**
 * ============================================================
 * Types
 * ============================================================
 */

type GetAdminAttendanceHistoryQuery = {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    classId?: string;
    subjectId?: string;
    instructorId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?:
    | "newest"
    | "oldest"
    | "highest_attendance"
    | "lowest_attendance";
};

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type AttendanceSummary = {
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
};

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
    "present",
    "absent",
    "late",
    "excused",
];

/**
 * ============================================================
 * Helpers
 * ============================================================
 */

const isValidObjectId = (value?: string) =>
    !!value && mongoose.Types.ObjectId.isValid(value);

const buildSessionDateFilter = (
    startDate?: string,
    endDate?: string
) => {
    if (!startDate && !endDate) return undefined;

    const dateFilter: Record<string, Date> = {};

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
    }

    return dateFilter;
};

const calculateAttendanceRate = (
    present: number,
    totalStudents: number
) => {
    if (!totalStudents) return 0;
    return Number(((present / totalStudents) * 100).toFixed(2));
};

const normalizeAttendanceSummary = (
    summary?: Partial<AttendanceSummary>
): AttendanceSummary => {
    const totalStudents = summary?.totalStudents ?? 0;
    const present = summary?.present ?? 0;
    const absent = summary?.absent ?? 0;
    const late = summary?.late ?? 0;
    const excused = summary?.excused ?? 0;

    return {
        totalStudents,
        present,
        absent,
        late,
        excused,
        attendanceRate: calculateAttendanceRate(
            present,
            totalStudents
        ),
    };
};

/**
 * ============================================================
 * Shared aggregation builder
 * ============================================================
 */

const buildAdminAttendanceHistoryBasePipeline = (
    query?: Partial<GetAdminAttendanceHistoryQuery>
): PipelineStage[] => {
    const sessionMatch: Record<string, any> = {};

    if (query?.status) {
        sessionMatch.status = query.status;
    }
    const sessionDateFilter = buildSessionDateFilter(
        query?.startDate,
        query?.endDate
    );

    if (sessionDateFilter) {
        sessionMatch.sessionDate = sessionDateFilter;
    }

    const pipeline: PipelineStage[] = [
        {
            $match: sessionMatch,
        },
        {
            $lookup: {
                from: "teacherassignments",
                localField: "teacherAssignment",
                foreignField: "_id",
                as: "teacherAssignment",
            },
        },
        {
            $unwind: {
                path: "$teacherAssignment",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "subjects",
                localField: "teacherAssignment.subject",
                foreignField: "_id",
                as: "subject",
            },
        },
        {
            $unwind: {
                path: "$subject",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "classes",
                localField: "teacherAssignment.class",
                foreignField: "_id",
                as: "class",
            },
        },
        {
            $unwind: {
                path: "$class",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "teacherAssignment.instructor",
                foreignField: "_id",
                as: "instructor",
            },
        },
        {
            $unwind: {
                path: "$instructor",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "class.department",
                foreignField: "_id",
                as: "department",
            },
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true,
            },
        },
    ];

    const extraMatch: Record<string, any> = {};
    const search = query?.search?.trim();

    if (isValidObjectId(query?.departmentId)) {
        extraMatch["department._id"] = new Types.ObjectId(
            query!.departmentId
        );
    }

    if (isValidObjectId(query?.classId)) {
        extraMatch["class._id"] = new Types.ObjectId(
            query!.classId
        );
    }

    if (isValidObjectId(query?.subjectId)) {
        extraMatch["subject._id"] = new Types.ObjectId(
            query!.subjectId
        );
    }

    if (isValidObjectId(query?.instructorId)) {
        extraMatch["instructor._id"] = new Types.ObjectId(
            query!.instructorId
        );
    }

    if (search) {
        extraMatch.$or = [
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
            {
                "class.name": {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                "class.section": {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                "instructor.name": {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                "department.name": {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (Object.keys(extraMatch).length > 0) {
        pipeline.push({
            $match: extraMatch,
        });
    }

    pipeline.push(
        {
            $lookup: {
                from: "attendances",
                let: {
                    sessionId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$session", "$$sessionId"],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalStudents: { $sum: 1 },
                            present: {
                                $sum: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$status",
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
                                                "$status",
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
                                                "$status",
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
                                                "$status",
                                                "excused",
                                            ],
                                        },
                                        1,
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ],
                as: "attendanceStats",
            },
        },
        {
            $addFields: {
                attendanceSummary: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$attendanceStats",
                                0,
                            ],
                        },
                        {
                            totalStudents: 0,
                            present: 0,
                            absent: 0,
                            late: 0,
                            excused: 0,
                        },
                    ],
                },
            },
        },
        {
            $addFields: {
                "attendanceSummary.attendanceRate": {
                    $cond: [
                        {
                            $gt: [
                                "$attendanceSummary.totalStudents",
                                0,
                            ],
                        },
                        {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$attendanceSummary.present",
                                                "$attendanceSummary.totalStudents",
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        0,
                    ],
                },
            },
        },
        {
            $project: {
                _id: 1,
                status: 1,
                sessionDate: 1,
                startTime: 1,
                endTime: 1,
                createdAt: 1,

                subject: {
                    _id: "$subject._id",
                    name: "$subject.name",
                    code: "$subject.code",
                },

                class: {
                    _id: "$class._id",
                    name: "$class.name",
                    section: "$class.section",
                    semester: "$class.semester",
                },

                department: {
                    _id: "$department._id",
                    name: "$department.name",
                },

                instructor: {
                    _id: "$instructor._id",
                    fullName: "$instructor.name",
                    email: "$instructor.email",
                },

                attendanceSummary: 1,
            },
        }
    );

    return pipeline;
};

/**
 * ============================================================
 * 1) ADMIN ATTENDANCE HISTORY STATS
 * Fixed top cards + charts
 * ============================================================
 */
export const getAdminAttendanceHistoryStatsService =
    async () => {
        try {
            const pipeline =
                buildAdminAttendanceHistoryBasePipeline();

            const sessions =
                await SessionModel.aggregate(pipeline);

            const summary = sessions.reduce(
                (acc, session: any) => {
                    const stats =
                        session.attendanceSummary || {};

                    acc.totalSessions += 1;
                    acc.totalAttendanceRecords +=
                        stats.totalStudents || 0;
                    acc.present +=
                        stats.present || 0;
                    acc.absent +=
                        stats.absent || 0;
                    acc.late += stats.late || 0;
                    acc.excused +=
                        stats.excused || 0;

                    return acc;
                },
                {
                    totalSessions: 0,
                    totalAttendanceRecords: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                }
            );

            const averageAttendanceRate =
                summary.totalAttendanceRecords > 0
                    ? Number(
                        (
                            (summary.present /
                                summary.totalAttendanceRecords) *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            const attendanceDistribution = [
                {
                    name: "Present",
                    value: summary.present,
                },
                {
                    name: "Absent",
                    value: summary.absent,
                },
                {
                    name: "Late",
                    value: summary.late,
                },
                {
                    name: "Excused",
                    value: summary.excused,
                },
            ];

            const attendanceTrendMap = new Map<
                string,
                {
                    date: string;
                    totalPresent: number;
                    totalStudents: number;
                }
            >();

            for (const session of sessions) {
                const rawDate =
                    session.sessionDate ||
                    session.createdAt;

                if (!rawDate) continue;

                const date = new Date(rawDate);
                const dateKey = date
                    .toISOString()
                    .split("T")[0];

                if (
                    !attendanceTrendMap.has(dateKey)
                ) {
                    attendanceTrendMap.set(dateKey, {
                        date: dateKey,
                        totalPresent: 0,
                        totalStudents: 0,
                    });
                }

                const current =
                    attendanceTrendMap.get(
                        dateKey
                    )!;
                current.totalPresent +=
                    session.attendanceSummary
                        ?.present || 0;
                current.totalStudents +=
                    session.attendanceSummary
                        ?.totalStudents || 0;
            }

            const attendanceTrend = Array.from(
                attendanceTrendMap.values()
            )
                .map((item) => ({
                    date: item.date,
                    attendanceRate:
                        item.totalStudents > 0
                            ? Number(
                                (
                                    (item.totalPresent /
                                        item.totalStudents) *
                                    100
                                ).toFixed(2)
                            )
                            : 0,
                }))
                .sort((a, b) =>
                    a.date.localeCompare(b.date)
                );

            const classWiseAttendanceMap = new Map<
                string,
                {
                    classId: string;
                    className: string;
                    totalPresent: number;
                    totalStudents: number;
                }
            >();

            for (const session of sessions) {
                const classId =
                    session.class?._id?.toString();

                if (!classId) continue;

                const className = [
                    session.class?.name || "",
                    session.class?.section
                        ? `(${session.class.section})`
                        : "",
                ]
                    .join(" ")
                    .trim();

                if (
                    !classWiseAttendanceMap.has(
                        classId
                    )
                ) {
                    classWiseAttendanceMap.set(
                        classId,
                        {
                            classId,
                            className,
                            totalPresent: 0,
                            totalStudents: 0,
                        }
                    );
                }

                const current =
                    classWiseAttendanceMap.get(
                        classId
                    )!;

                current.totalPresent +=
                    session.attendanceSummary
                        ?.present || 0;
                current.totalStudents +=
                    session.attendanceSummary
                        ?.totalStudents || 0;
            }

            const classWiseAttendance =
                Array.from(
                    classWiseAttendanceMap.values()
                )
                    .map((item) => ({
                        classId: item.classId,
                        className: item.className,
                        attendanceRate:
                            item.totalStudents > 0
                                ? Number(
                                    (
                                        (item.totalPresent /
                                            item.totalStudents) *
                                        100
                                    ).toFixed(2)
                                )
                                : 0,
                    }))
                    .sort(
                        (a, b) =>
                            b.attendanceRate -
                            a.attendanceRate
                    );

            return {
                summary: {
                    ...summary,
                    averageAttendanceRate,
                },
                charts: {
                    attendanceDistribution,
                    attendanceTrend,
                    classWiseAttendance,
                },
            };
        } catch (error) {
            console.error(
                "getAdminAttendanceHistoryStatsService error:",
                error
            );

            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to fetch admin attendance history statistics"
            );
        }
    };

/**
 * ============================================================
 * 2) ADMIN ATTENDANCE HISTORY TABLE
 * Only paginated/filterable table data
 * ============================================================
 */
export const getAdminAttendanceHistoryService = async (
    query: GetAdminAttendanceHistoryQuery
) => {
    try {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.max(
            Number(query.limit) || 10,
            1
        );
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy || "newest";

        const pipeline =
            buildAdminAttendanceHistoryBasePipeline(
                query
            );

        let sortStage: Record<string, 1 | -1> = {
            sessionDate: -1,
            createdAt: -1,
        };

        if (sortBy === "oldest") {
            sortStage = {
                sessionDate: 1,
                createdAt: 1,
            };
        }

        if (sortBy === "highest_attendance") {
            sortStage = {
                "attendanceSummary.attendanceRate": -1,
                sessionDate: -1,
            };
        }

        if (sortBy === "lowest_attendance") {
            sortStage = {
                "attendanceSummary.attendanceRate": 1,
                sessionDate: -1,
            };
        }

        const totalPipeline: PipelineStage[] = [
            ...pipeline,
            {
                $count: "total",
            },
        ];

        const dataPipeline: PipelineStage[] = [
            ...pipeline,
            {
                $sort: sortStage,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ];

        const [totalResult, sessions] =
            await Promise.all([
                SessionModel.aggregate(totalPipeline),
                SessionModel.aggregate(dataPipeline),
            ]);

        const total = totalResult[0]?.total || 0;

        return {
            sessions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error(
            "getAdminAttendanceHistoryService error:",
            error
        );

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to fetch admin attendance history"
        );
    }
};

/**
 * ============================================================
 * 3) ADMIN SINGLE SESSION ATTENDANCE DETAILS
 * ============================================================
 */
export const getAdminAttendanceSessionDetailsService = async (
    sessionId: string
) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Invalid session id"
            );
        }

        const session = await SessionModel.findById(
            sessionId
        )
            .populate({
                path: "teacherAssignment",
                select: "subject class instructor",
                populate: [
                    {
                        path: "subject",
                        select: "name code",
                    },
                    {
                        path: "class",
                        select:
                            "name section semester department",
                        populate: {
                            path: "department",
                            select: "name",
                        },
                    },
                    {
                        path: "instructor",
                        select: "name email",
                    },
                ],
            })
            .lean();

        if (!session) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Session not found"
            );
        }

        const attendanceRecords =
            await AttendanceModel.find({
                session: session._id,
            })
                .populate({
                    path: "student",
                    select:
                        "name email rollNumber registrationNumber",
                })
                .sort({ createdAt: 1 })
                .lean();

        const rawSummary = attendanceRecords.reduce(
            (acc, record: any) => {
                acc.totalStudents += 1;

                if (
                    ATTENDANCE_STATUSES.includes(
                        record.status as AttendanceStatus
                    )
                ) {
                    acc[record.status] += 1;
                }

                return acc;
            },
            {
                totalStudents: 0,
                present: 0,
                absent: 0,
                late: 0,
                excused: 0,
            } as Record<string, number>
        );

        const summary = normalizeAttendanceSummary({
            totalStudents:
                rawSummary.totalStudents,
            present: rawSummary.present,
            absent: rawSummary.absent,
            late: rawSummary.late,
            excused: rawSummary.excused,
        });

        const charts = {
            attendanceDistribution: [
                {
                    name: "Present",
                    value: summary.present,
                },
                {
                    name: "Absent",
                    value: summary.absent,
                },
                {
                    name: "Late",
                    value: summary.late,
                },
                {
                    name: "Excused",
                    value: summary.excused,
                },
            ],
        };

        const students = attendanceRecords.map(
            (record: any) => ({
                _id: record._id,
                status: record.status,
                remarks: record.remarks || "",
                markedAt:
                    record.markedAt ||
                    record.createdAt ||
                    null,

                student: {
                    _id:
                        record.student?._id || null,
                    fullName:
                        record.student?.name ||
                        "N/A",
                    email:
                        record.student?.email || "",
                    rollNumber:
                        record.student
                            ?.rollNumber ||
                        record.student
                            ?.registrationNumber ||
                        "",
                },
            })
        );

        const teacherAssignment: any =
            session.teacherAssignment || {};

        const normalizedSession = {
            _id: session._id,
            status: session.status,
            sessionDate:
                (session as any).sessionDate ||
                (session as any).date ||
                session.createdAt,
            startTime:
                (session as any).startTime || null,
            endTime:
                (session as any).endTime || null,
            createdAt: session.createdAt,

            subject: teacherAssignment.subject
                ? {
                    _id: teacherAssignment.subject._id,
                    name: teacherAssignment.subject.name,
                    code: teacherAssignment.subject.code,
                }
                : null,

            class: teacherAssignment.class
                ? {
                    _id: teacherAssignment.class._id,
                    name: teacherAssignment.class.name,
                    section:
                        teacherAssignment.class.section,
                    semester:
                        teacherAssignment.class.semester,
                }
                : null,

            department:
                teacherAssignment.class
                    ?.department
                    ? {
                        _id: teacherAssignment.class
                            .department._id,
                        name: teacherAssignment.class
                            .department.name,
                    }
                    : null,

            instructor:
                teacherAssignment.instructor
                    ? {
                        _id: teacherAssignment
                            .instructor._id,
                        fullName:
                            teacherAssignment
                                .instructor
                                .name,
                        email:
                            teacherAssignment
                                .instructor
                                .email,
                    }
                    : null,
        };

        return {
            session: normalizedSession,
            summary,
            charts,
            students,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        console.error(
            "getAdminAttendanceSessionDetailsService error:",
            error
        );

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to fetch session attendance details"
        );
    }
};