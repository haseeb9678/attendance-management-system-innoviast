import { Types, type SortOrder } from "mongoose";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";

import { SessionModel } from "./session.model.js";
import { TeacherAssignmentModel } from "../teacherAssignment/teacherAssignment.model.js";
import { CreateSessionInput } from "@attendance/shared-zod";
import { buildSessionDateTime } from "../../shared/utils/SessionHelpers.js";

import { DateTime } from "luxon";

export const addSessionService = async (
    data: CreateSessionInput
) => {
    const assignmentExists =
        await TeacherAssignmentModel.exists({
            _id: data.teacherAssignment,
        });

    if (!assignmentExists) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Teacher assignment not found."
        );
    }

    // Normalize the selected session date to the Karachi day start,
    // then store as UTC Date so it stays consistent on localhost + Vercel
    const normalizedSessionDate = DateTime.fromJSDate(
        new Date(data.date),
        { zone: "Asia/Karachi" }
    )
        .startOf("day")
        .toUTC()
        .toJSDate();

    const sessionExists =
        await SessionModel.findOne({
            teacherAssignment: data.teacherAssignment,
            date: normalizedSessionDate,
            startTime: data.startTime,
        });

    if (sessionExists) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "Session already exists for this teacher assignment, date and start time."
        );
    }

    const session = await SessionModel.create({
        ...data,
        date: normalizedSessionDate,
    });

    return session;
};

interface GetAllSessionsOptions {
    page?: number;
    limit?: number;
    search?: string;
    teacherAssignment?: string;
    status?: CreateSessionInput["status"];
    date?: string;
    sort?: "newest" | "oldest";
}

export const getAllSessionsService = async ({
    page = 1,
    limit = 10,
    search = "",
    teacherAssignment,
    status,
    date,
    sort = "newest",
}: GetAllSessionsOptions) => {
    const filter: Record<string, unknown> = {};

    if (teacherAssignment) {
        filter.teacherAssignment =
            new Types.ObjectId(
                teacherAssignment
            );
    }

    if (status) {
        filter.status = status;
    }

    if (date) {
        const start = new Date(date);
        const end = new Date(date);

        end.setDate(end.getDate() + 1);

        filter.date = {
            $gte: start,
            $lt: end,
        };
    }

    if (search.trim()) {
        filter.room = {
            $regex: search,
            $options: "i",
        };
    }

    const sortOption: Record<
        string,
        SortOrder
    > =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [sessions, total] =
        await Promise.all([
            SessionModel.find(filter)
                .populate({
                    path: "teacherAssignment",
                    populate: [
                        {
                            path: "instructor",
                            select:
                                "name employeeId",
                        },
                        {
                            path: "subject",
                            select: "name code",
                        },
                        {
                            path: "class",
                            select: "name section code",
                        },
                    ],
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),

            SessionModel.countDocuments(
                filter
            ),
        ]);

    return {
        sessions,
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
            hasPreviousPage: page > 1,
        },
    };
};

export const getSessionService = async (
    sessionId: string
) => {
    const session =
        await SessionModel.findById(
            new Types.ObjectId(sessionId)
        )
            .populate({
                path: "teacherAssignment",
                populate: [
                    {
                        path: "instructor",
                        select:
                            "name employeeId",
                    },
                    {
                        path: "subject",
                        select: "name code",
                    },
                    {
                        path: "class",
                        select: "name section code",
                    },
                ],
            })
            .lean();

    if (!session) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Session not found."
        );
    }

    return session;
};

export const updateSessionService =
    async (
        sessionId: string,
        data: CreateSessionInput
    ) => {
        const session =
            await SessionModel.findById(
                sessionId
            );

        if (!session) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Session not found."
            );
        }

        const assignmentExists =
            await TeacherAssignmentModel.exists(
                {
                    _id: data.teacherAssignment,
                }
            );

        if (!assignmentExists) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Teacher assignment not found."
            );
        }

        const duplicateSession =
            await SessionModel.findOne({
                _id: { $ne: sessionId },
                teacherAssignment:
                    data.teacherAssignment,
                date: data.date,
                startTime:
                    data.startTime,
            });

        if (duplicateSession) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "Session already exists for this teacher assignment, date and start time."
            );
        }

        Object.assign(session, data);

        await session.save();

        return session;
    };

export const deleteSessionService = async (sessionId: string) => {
    const session = await SessionModel.findById(sessionId);

    if (!session) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Session not found."
        );
    }

    if (session.status !== "scheduled") {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only scheduled sessions can be deleted."
        );
    }

    await SessionModel.findByIdAndDelete(sessionId);

    return session;
};


export const updateSessionStatusesService = async () => {
    const now = new Date();

    const sessions = await SessionModel.find({
        status: { $ne: "cancelled" },
    });


    if (!sessions.length) {
        return { totalChecked: 0, updatedCount: 0 };
    }

    const bulkOperations: Array<{
        updateOne: {
            filter: { _id: typeof sessions[number]["_id"] };
            update: { $set: { status: "scheduled" | "ongoing" | "completed" } };
        };
    }> = [];

    for (const session of sessions) {
        const sessionStart = buildSessionDateTime(session.date, session.startTime);
        const sessionEnd = buildSessionDateTime(session.date, session.endTime);

        let nextStatus: "scheduled" | "ongoing" | "completed";

        if (now >= sessionEnd) {
            nextStatus = "completed";
        } else if (now >= sessionStart && now < sessionEnd) {
            nextStatus = "ongoing";
        } else {
            nextStatus = "scheduled";
        }

        if (session.status !== nextStatus) {
            bulkOperations.push({
                updateOne: {
                    filter: { _id: session._id },
                    update: { $set: { status: nextStatus } },
                },
            });
        }
    }



    if (bulkOperations.length > 0) {
        const result = await SessionModel.bulkWrite(bulkOperations);

    }

    return { totalChecked: sessions.length, updatedCount: bulkOperations.length };
};