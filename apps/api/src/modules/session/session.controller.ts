import { SESSION_STATUS, SessionStatus } from "@attendance/shared-types";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";

import {
    addSessionService,
    deleteSessionService,
    getAllSessionsService,
    getSessionService,
    updateSessionService,
} from "./session.service.js";

/**
 * Create Session
 */
export const addSession = asyncHandler(async (req, res) => {
    const session = await addSessionService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "Session created successfully.",
            session
        )
    );
});

/**
 * Get All Sessions
 */
export const getAllSessions = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : "";

    const teacherAssignment =
        typeof req.query.teacherAssignment === "string"
            ? req.query.teacherAssignment
            : undefined;

    const status: SessionStatus | undefined =
        typeof req.query.status === "string" &&
            SESSION_STATUS.includes(
                req.query.status as SessionStatus
            )
            ? (req.query.status as SessionStatus)
            : undefined;

    const date =
        typeof req.query.date === "string"
            ? req.query.date
            : undefined;

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest";

    const { sessions, meta } =
        await getAllSessionsService({
            page,
            limit,
            search,
            teacherAssignment,
            status,
            date,
            sort,
        });

    res.status(200).json(
        new ApiResponse(
            200,
            "Sessions fetched successfully.",
            sessions,
            meta
        )
    );
});

/**
 * Get Session By ID
 */
export const getSession = asyncHandler(async (req, res) => {
    const session = await getSessionService(
        req.params.id as string
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Session fetched successfully.",
            session
        )
    );
});

/**
 * Update Session
 */
export const updateSession = asyncHandler(async (req, res) => {
    const session =
        await updateSessionService(
            req.params.id as string,
            req.body
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Session updated successfully.",
            session
        )
    );
});

/**
 * Delete Session
 */
export const deleteSession = asyncHandler(async (req, res) => {
    await deleteSessionService(
        req.params.id as string
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Session deleted successfully.",
            null
        )
    );
});