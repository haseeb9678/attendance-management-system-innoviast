import { StatusCodes } from "http-status-codes";
import { USER_ROLE } from "@attendance/shared-types";

import ApiError from "../../shared/utils/ApiError.js";

import { UserModel } from "../user/user.model.js";
import { SessionModel } from "../session/session.model.js";
import { AttendanceModel } from "../attendance/attendance.model.js";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { DepartmentModel } from "../department/department.model.js";
import { ClassModel } from "../class/class.model.js";
import { SubjectModel } from "../subject/subject.model.js";
import { UpdateUserInput } from "@attendance/shared-zod";

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
                .select("fullName email role status createdAt")
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
                            select: "fullName email",
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
                .populate("instructor", "fullName email")
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