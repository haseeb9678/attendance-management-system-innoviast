import { Types } from "mongoose";

import { SessionModel } from "../session/session.model.js";

import ApiError from "../../shared/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { USER_ROLE } from "@attendance/shared-types";
import { UserModel } from "../user/user.model.js";
import { AttendanceModel } from "../attendance/attendance.model.js";
import { UpdateUserInput } from "@attendance/shared-zod";

interface GetAttendanceHistoryOptions {
    instructorId: string;

    page?: number;
    limit?: number;

    search?: string;

    class?: string;
    subject?: string;

    status?: "completed" | "pending";

    sort?: "newest" | "oldest";
}




export const getAttendanceStatsService = async (
    instructorId: string
) => {
    const result = await SessionModel.aggregate([
        /**
         * Teacher Assignment
         */
        {
            $lookup: {
                from: "teacherassignments",
                localField: "teacherAssignment",
                foreignField: "_id",
                as: "teacherAssignment",
            },
        },
        {
            $unwind: "$teacherAssignment",
        },

        /**
         * Instructor
         */
        {
            $match: {
                "teacherAssignment.instructor":
                    new Types.ObjectId(instructorId),
            },
        },

        /**
         * Attendance
         */
        {
            $lookup: {
                from: "attendances",
                localField: "_id",
                foreignField: "session",
                as: "attendance",
            },
        },

        /**
         * Attendance Summary
         */
        {
            $addFields: {
                totalMarked: {
                    $size: "$attendance",
                },

                present: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            as: "item",
                            cond: {
                                $eq: [
                                    "$$item.status",
                                    "present",
                                ],
                            },
                        },
                    },
                },

                absent: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            as: "item",
                            cond: {
                                $eq: [
                                    "$$item.status",
                                    "absent",
                                ],
                            },
                        },
                    },
                },

                late: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            as: "item",
                            cond: {
                                $eq: [
                                    "$$item.status",
                                    "late",
                                ],
                            },
                        },
                    },
                },

                excused: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            as: "item",
                            cond: {
                                $eq: [
                                    "$$item.status",
                                    "excused",
                                ],
                            },
                        },
                    },
                },

                attendanceStatus: {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $size: "$attendance",
                                },
                                0,
                            ],
                        },
                        "completed",
                        "pending",
                    ],
                },
            },
        },

        /**
         * Dashboard Stats
         */
        {
            $group: {
                _id: null,

                totalSessions: {
                    $sum: 1,
                },

                completedSessions: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "completed",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                pendingSessions: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$attendanceStatus",
                                    "pending",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                totalMarked: {
                    $sum: "$totalMarked",
                },

                present: {
                    $sum: "$present",
                },

                absent: {
                    $sum: "$absent",
                },

                late: {
                    $sum: "$late",
                },

                excused: {
                    $sum: "$excused",
                },
            },
        },

        {
            $project: {
                _id: 0,
            },
        },
    ]);

    return (
        result[0] ?? {
            totalSessions: 0,
            completedSessions: 0,
            pendingSessions: 0,

            totalMarked: 0,

            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
        }
    );
};

export const getAttendanceHistoryService = async ({
    instructorId,
    page = 1,
    limit = 10,
    search = "",
    class: classId,
    subject,
    status,
    sort = "newest",
}: GetAttendanceHistoryOptions) => {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
        /**
         * Teacher Assignment
         */
        {
            $lookup: {
                from: "teacherassignments",
                localField: "teacherAssignment",
                foreignField: "_id",
                as: "teacherAssignment",
            },
        },
        {
            $unwind: "$teacherAssignment",
        },

        /**
         * Instructor Filter
         */
        {
            $match: {
                "teacherAssignment.instructor":
                    new Types.ObjectId(instructorId),
            },
        },
    ];

    /**
     * Optional Filters
     */

    if (classId) {
        pipeline.push({
            $match: {
                "teacherAssignment.class":
                    new Types.ObjectId(classId),
            },
        });
    }

    if (subject) {
        pipeline.push({
            $match: {
                "teacherAssignment.subject":
                    new Types.ObjectId(subject),
            },
        });
    }

    if (search.trim()) {
        pipeline.push({
            $match: {
                room: {
                    $regex: search,
                    $options: "i",
                },
            },
        });
    }

    /**
     * Populate Subject
     */

    pipeline.push({
        $lookup: {
            from: "subjects",
            localField: "teacherAssignment.subject",
            foreignField: "_id",
            as: "subject",
        },
    });

    pipeline.push({
        $unwind: "$subject",
    });

    /**
     * Populate Class
     */

    pipeline.push({
        $lookup: {
            from: "classes",
            localField: "teacherAssignment.class",
            foreignField: "_id",
            as: "class",
        },
    });

    pipeline.push({
        $unwind: "$class",
    });

    /**
     * Populate Department
     */

    pipeline.push({
        $lookup: {
            from: "departments",
            localField: "teacherAssignment.department",
            foreignField: "_id",
            as: "department",
        },
    });

    pipeline.push({
        $unwind: "$department",
    });

    /**
     * Attendance
     */

    pipeline.push({
        $lookup: {
            from: "attendances",
            localField: "_id",
            foreignField: "session",
            as: "attendance",
        },
    });

    /**
     * Attendance Summary
     */

    pipeline.push({
        $addFields: {
            totalMarked: {
                $size: "$attendance",
            },

            present: {
                $size: {
                    $filter: {
                        input: "$attendance",
                        as: "item",
                        cond: {
                            $eq: [
                                "$$item.status",
                                "present",
                            ],
                        },
                    },
                },
            },

            absent: {
                $size: {
                    $filter: {
                        input: "$attendance",
                        as: "item",
                        cond: {
                            $eq: [
                                "$$item.status",
                                "absent",
                            ],
                        },
                    },
                },
            },

            late: {
                $size: {
                    $filter: {
                        input: "$attendance",
                        as: "item",
                        cond: {
                            $eq: [
                                "$$item.status",
                                "late",
                            ],
                        },
                    },
                },
            },

            excused: {
                $size: {
                    $filter: {
                        input: "$attendance",
                        as: "item",
                        cond: {
                            $eq: [
                                "$$item.status",
                                "excused",
                            ],
                        },
                    },
                },
            },

            attendanceStatus: {
                $cond: [
                    {
                        $gt: [
                            {
                                $size: "$attendance",
                            },
                            0,
                        ],
                    },
                    "completed",
                    "pending",
                ],
            },
        },
    });

    /**
     * Attendance Status Filter
     */

    if (status) {
        pipeline.push({
            $match: {
                attendanceStatus: status,
            },
        });
    }

    /**
     * Remove Attendance Array
     */

    pipeline.push({
        $project: {
            attendance: 0,
        },
    });

    /**
     * Sorting
     */

    pipeline.push({
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

    /**
     * Pagination + Total Count
     */

    pipeline.push({
        $facet: {
            data: [
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ],

            total: [
                {
                    $count: "count",
                },
            ],
        },
    });

    const result =
        await SessionModel.aggregate(pipeline);

    const history = result[0].data;

    const total =
        result[0].total[0]?.count ?? 0;

    return {
        history,

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



interface GetClassOverviewOptions {
    instructorId: string;
    classId: string;

    page?: number;
    limit?: number;

    search?: string;

    sort?: "newest" | "oldest";
}

export const getClassOverviewService = async ({
    instructorId,
    classId,
    page = 1,
    limit = 10,
    search = "",
    sort = "newest",
}: GetClassOverviewOptions) => {


    const assignments = await TeacherAssignmentModel.find({
        instructor: new Types.ObjectId(instructorId),
        class: new Types.ObjectId(classId),
        status: "active",
    })
        .populate("class", "name code description status")
        .populate("department", "name code")
        .populate("subject", "name code creditHours")
        .lean();

    if (!assignments.length) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not assigned to this class."
        );
    }

    /**
     * Class Information
     */
    const classInfo = {
        ...(assignments[0].class as any),
        department: assignments[0].department,
    };

    /**
     * Subjects
     */
    const subjects = assignments.map(
        (assignment) => assignment.subject
    );

    /**
     * Student Filters
     */
    const studentFilter: Record<string, unknown> = {
        role: USER_ROLE.STUDENT,
        class: new Types.ObjectId(classId),
    };

    if (search.trim()) {
        studentFilter.$or = [
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
                rollNumber: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const skip = (page - 1) * limit;

    const sortOption =
        (sort === "oldest"
            ? {
                rollNumber: 1,
            }
            : {
                rollNumber: -1,
            }) as Record<string, 1 | -1>;

    /**
     * Students
     */
    const [students, total] =
        await Promise.all([
            UserModel.find(studentFilter)
                .select(
                    "name registrationNumber rollNumber email phoneNumber"
                )
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),

            UserModel.countDocuments(studentFilter),
        ]);

    /**
     * Teacher Assignment IDs
     */
    const assignmentIds = assignments.map(
        (assignment) => assignment._id
    );

    /**
     * Sessions
     */
    const sessions = await SessionModel.find({
        teacherAssignment: {
            $in: assignmentIds,
        },
    })
        .select("_id")
        .lean();

    const sessionIds = sessions.map(
        (session) => session._id
    );
    /**
 * Attendance Statistics
 */
    const attendanceStats =
        sessionIds.length > 0
            ? await AttendanceModel.aggregate([
                {
                    $match: {
                        session: {
                            $in: sessionIds,
                        },
                    },
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ])
            : [];

    const present =
        attendanceStats.find(
            (item) => item._id === "present"
        )?.count ?? 0;

    const absent =
        attendanceStats.find(
            (item) => item._id === "absent"
        )?.count ?? 0;

    const late =
        attendanceStats.find(
            (item) => item._id === "late"
        )?.count ?? 0;

    const excused =
        attendanceStats.find(
            (item) => item._id === "excused"
        )?.count ?? 0;

    const totalAttendance =
        present + absent + late + excused;

    /**
     * Completed / Pending Sessions
     */
    const completedSessions =
        sessionIds.length === 0
            ? 0
            : await AttendanceModel.distinct(
                "session",
                {
                    session: {
                        $in: sessionIds,
                    },
                }
            ).then(
                (sessions) => sessions.length
            );

    const pendingSessions =
        sessions.length - completedSessions;

    /**
     * Average Attendance
     *
     * Formula:
     * Present Records / Total Attendance Records
     */
    const averageAttendance =
        totalAttendance === 0
            ? 0
            : Number(
                (
                    (present /
                        totalAttendance) *
                    100
                ).toFixed(1)
            );

    /**
     * Response
     */
    return {
        class: classInfo,

        subjects,

        stats: {
            totalStudents: total,

            totalSubjects:
                subjects.length,

            totalSessions:
                sessions.length,

            completedSessions,

            pendingSessions,

            averageAttendance,

            present,

            absent,

            late,

            excused,
        },

        students,

        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(
                total / limit
            ),
            hasNextPage:
                page <
                Math.ceil(total / limit),
            hasPreviousPage:
                page > 1,
        },
    };
};


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

export const getInstructorDashboardService = async (
    instructorId: string
) => {
    const result =
        await TeacherAssignmentModel.aggregate([
            /**
             * Active Assignments of Instructor
             */
            {
                $match: {
                    instructor: new Types.ObjectId(
                        instructorId
                    ),
                    status: "active",
                },
            },

            /**
             * Class
             */
            {
                $lookup: {
                    from: "classes",
                    localField: "class",
                    foreignField: "_id",
                    as: "class",
                },
            },
            {
                $unwind: "$class",
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
             * Students of Class
             */
            {
                $lookup: {
                    from: "users",
                    let: {
                        classId: "$class._id",
                    },
                    pipeline: [
                        {
                            $match: {
                                role: "student",
                                $expr: {
                                    $eq: [
                                        "$class",
                                        "$$classId",
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                rollNumber: 1,
                                registrationNumber: 1,
                            },
                        },
                    ],
                    as: "students",
                },
            },

            /**
             * Sessions
             
 */
            {
                $lookup: {
                    from: "sessions",

                    let: {
                        assignmentId: "$_id",

                        subject: "$subject",

                        class: "$class",

                        department: "$department",
                    },

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

                        /**
                         * Attendance
                         */
                        {
                            $lookup: {
                                from: "attendances",
                                localField: "_id",
                                foreignField: "session",
                                as: "attendance",
                            },
                        },

                        /**
                         * Attendance Summary
                         */
                        {
                            $addFields: {
                                totalMarked: {
                                    $size: "$attendance",
                                },

                                present: {
                                    $size: {
                                        $filter: {
                                            input: "$attendance",
                                            as: "item",
                                            cond: {
                                                $eq: [
                                                    "$$item.status",
                                                    "present",
                                                ],
                                            },
                                        },
                                    },
                                },

                                absent: {
                                    $size: {
                                        $filter: {
                                            input: "$attendance",
                                            as: "item",
                                            cond: {
                                                $eq: [
                                                    "$$item.status",
                                                    "absent",
                                                ],
                                            },
                                        },
                                    },
                                },

                                late: {
                                    $size: {
                                        $filter: {
                                            input: "$attendance",
                                            as: "item",
                                            cond: {
                                                $eq: [
                                                    "$$item.status",
                                                    "late",
                                                ],
                                            },
                                        },
                                    },
                                },

                                excused: {
                                    $size: {
                                        $filter: {
                                            input: "$attendance",
                                            as: "item",
                                            cond: {
                                                $eq: [
                                                    "$$item.status",
                                                    "excused",
                                                ],
                                            },
                                        },
                                    },
                                },

                                attendanceStatus: {
                                    $cond: [
                                        {
                                            $gt: [
                                                {
                                                    $size: "$attendance",
                                                },
                                                0,
                                            ],
                                        },
                                        "completed",
                                        "pending",
                                    ],
                                },

                                /**
                                 * Embed Assignment Information
                                 */
                                subject: {
                                    _id: "$$subject._id",
                                    name: "$$subject.name",
                                    code: "$$subject.code",
                                },

                                class: {
                                    _id: "$$class._id",
                                    name: "$$class.name",
                                    code: "$$class.code",
                                },

                                department: {
                                    _id: "$$department._id",
                                    name: "$$department.name",
                                    code: "$$department.code",
                                },
                            },
                        },

                        {
                            $project: {
                                attendance: 0,
                            },
                        },
                    ],

                    as: "sessions",
                },
            },

            /**
             * Assignment Statistics
             */
            {
                $addFields: {
                    totalStudents: {
                        $size: "$students",
                    },

                    totalSessions: {
                        $size: "$sessions",
                    },

                    completedSessions: {
                        $size: {
                            $filter: {
                                input:
                                    "$sessions",
                                as: "session",
                                cond: {
                                    $eq: [
                                        "$$session.attendanceStatus",
                                        "completed",
                                    ],
                                },
                            },
                        },
                    },

                    pendingSessions: {
                        $size: {
                            $filter: {
                                input:
                                    "$sessions",
                                as: "session",
                                cond: {
                                    $eq: [
                                        "$$session.attendanceStatus",
                                        "pending",
                                    ],
                                },
                            },
                        },
                    },

                    present: {
                        $sum: "$sessions.present",
                    },

                    absent: {
                        $sum: "$sessions.absent",
                    },

                    late: {
                        $sum: "$sessions.late",
                    },

                    excused: {
                        $sum: "$sessions.excused",
                    },

                    totalAttendance: {
                        $sum:
                            "$sessions.totalMarked",
                    },
                },
            },

            /**
             * PART 2 STARTS HERE
             * ($facet)
             */

            /**
 * Dashboard Response
 */
            {
                $facet: {
                    /**
                     * Overview Cards
                     */
                    overview: [
                        {
                            $group: {
                                _id: null,

                                totalAssignments: {
                                    $sum: 1,
                                },

                                totalClasses: {
                                    $addToSet: "$class._id",
                                },

                                totalSubjects: {
                                    $addToSet: "$subject._id",
                                },

                                totalStudents: {
                                    $sum: "$totalStudents",
                                },

                                totalSessions: {
                                    $sum: "$totalSessions",
                                },

                                completedSessions: {
                                    $sum: "$completedSessions",
                                },

                                pendingSessions: {
                                    $sum: "$pendingSessions",
                                },

                                present: {
                                    $sum: "$present",
                                },

                                absent: {
                                    $sum: "$absent",
                                },

                                late: {
                                    $sum: "$late",
                                },

                                excused: {
                                    $sum: "$excused",
                                },

                                totalAttendance: {
                                    $sum: "$totalAttendance",
                                },
                            },
                        },

                        {
                            $project: {
                                _id: 0,

                                totalAssignments: 1,

                                totalClasses: {
                                    $size: "$totalClasses",
                                },

                                totalSubjects: {
                                    $size: "$totalSubjects",
                                },

                                totalStudents: 1,

                                totalSessions: 1,

                                completedSessions: 1,

                                pendingSessions: 1,

                                present: 1,

                                absent: 1,

                                late: 1,

                                excused: 1,

                                attendanceRate: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$totalAttendance",
                                                0,
                                            ],
                                        },
                                        0,
                                        {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        {
                                                            $divide: [
                                                                "$present",
                                                                "$totalAttendance",
                                                            ],
                                                        },
                                                        100,
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],

                    /**
                     * Attendance Chart
                     */
                    attendance: [
                        {
                            $group: {
                                _id: null,

                                present: {
                                    $sum: "$present",
                                },

                                absent: {
                                    $sum: "$absent",
                                },

                                late: {
                                    $sum: "$late",
                                },

                                excused: {
                                    $sum: "$excused",
                                },
                            },
                        },

                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ],

                    /**
                     * Recent Sessions
                     */
                    recentSessions: [
                        {
                            $project: {
                                sessions: 1,
                            },
                        },

                        {
                            $unwind: "$sessions",
                        },

                        {
                            $sort: {
                                "sessions.date": -1,
                                "sessions.startTime": -1,
                            },
                        },

                        {
                            $limit: 5,
                        },

                        {
                            $project: {
                                _id: "$sessions._id",

                                room: "$sessions.room",

                                date: "$sessions.date",

                                startTime:
                                    "$sessions.startTime",

                                endTime:
                                    "$sessions.endTime",

                                attendanceStatus:
                                    "$sessions.attendanceStatus",

                                subject: {
                                    _id: "$subject._id",
                                    name: "$subject.name",
                                    code: "$subject.code",
                                },

                                class: {
                                    _id: "$class._id",
                                    name: "$class.name",
                                    code: "$class.code",
                                },

                                department: {
                                    _id: "$department._id",
                                    name: "$department.name",
                                    code: "$department.code",
                                },
                            },
                        },
                    ],

                    /**
                     * Upcoming Sessions
                     */
                    upcomingSessions: [
                        {
                            $project: {
                                sessions: 1,
                            },
                        },

                        {
                            $unwind: "$sessions",
                        },

                        {
                            $match: {
                                "sessions.date": {
                                    $gte: new Date(),
                                },
                            },
                        },

                        {
                            $sort: {
                                "sessions.date": 1,
                                "sessions.startTime": 1,
                            },
                        },

                        {
                            $limit: 5,
                        },

                        {
                            $project: {
                                _id: "$sessions._id",

                                room: "$sessions.room",

                                date: "$sessions.date",

                                startTime:
                                    "$sessions.startTime",

                                endTime:
                                    "$sessions.endTime",

                                attendanceStatus:
                                    "$sessions.attendanceStatus",

                                subject: {
                                    _id: "$subject._id",
                                    name: "$subject.name",
                                    code: "$subject.code",
                                },

                                class: {
                                    _id: "$class._id",
                                    name: "$class.name",
                                    code: "$class.code",
                                },

                                department: {
                                    _id: "$department._id",
                                    name: "$department.name",
                                    code: "$department.code",
                                },
                            },
                        },
                    ],

                    /**
                     * Class Cards
                     */
                    classSummary: [
                        {
                            $project: {
                                _id: 0,

                                class: {
                                    _id: "$class._id",
                                    name: "$class.name",
                                    code: "$class.code",
                                },

                                department: {
                                    _id: "$department._id",
                                    name: "$department.name",
                                    code: "$department.code",
                                },

                                subject: {
                                    _id: "$subject._id",
                                    name: "$subject.name",
                                    code: "$subject.code",
                                },

                                totalStudents: 1,

                                totalSessions: 1,

                                completedSessions: 1,

                                pendingSessions: 1,

                                present: 1,

                                absent: 1,

                                late: 1,

                                excused: 1,

                                attendanceRate: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$totalAttendance",
                                                0,
                                            ],
                                        },
                                        0,
                                        {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        {
                                                            $divide: [
                                                                "$present",
                                                                "$totalAttendance",
                                                            ],
                                                        },
                                                        100,
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },

                        {
                            $sort: {
                                "class.name": 1,
                            },
                        },
                    ],
                },
            },
        ]);

    const dashboard = result[0] ?? {};

    const overview = dashboard.overview?.[0] ?? {
        totalAssignments: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalStudents: 0,
        totalSessions: 0,
        completedSessions: 0,
        pendingSessions: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        attendanceRate: 0,
    };

    const attendance = dashboard.attendance?.[0] ?? {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
    };

    return {
        overview,

        attendance,

        recentSessions:
            dashboard.recentSessions ?? [],

        upcomingSessions:
            dashboard.upcomingSessions ?? [],

        classSummary:
            dashboard.classSummary ?? [],
    };
};

export const updateInstructorProfileService = async (
    instructorId: string,
    data: UpdateUserInput
) => {
    const user = await UserModel.findById(instructorId).select('+password');

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
        instructorId,
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

