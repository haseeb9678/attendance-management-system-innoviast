import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import {
    addSubjectService,
    deleteSubjectService,
    getAllSubjectsService,
    getSubjectService,
    updateSubjectService,
} from "./subject.service.js";

/**
 * Create Subject
 */
export const addSubject = asyncHandler(async (req, res) => {
    const subject = await addSubjectService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "Subject created successfully.",
            subject
        )
    );
});

/**
 * Get All Subjects
 */
export const getAllSubjects = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search =
        typeof req.query.search === "string"
            ? req.query.search
            : "";

    const department =
        typeof req.query.department === "string"
            ? req.query.department
            : undefined;

    const status =
        req.query.status === "active" ||
            req.query.status === "inactive"
            ? req.query.status
            : undefined;

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest";

    const { subjects, meta } = await getAllSubjectsService({
        page,
        limit,
        search,
        department,
        status,
        sort,
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Subjects fetched successfully.",
            subjects,
            meta
        )
    );
});

/**
 * Get Subject By ID
 */
export const getSubject = asyncHandler(async (req, res) => {
    const subject = await getSubjectService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject fetched successfully.",
            subject
        )
    );
});

/**
 * Update Subject
 */
export const updateSubject = asyncHandler(async (req, res) => {
    const subject = await updateSubjectService(
        req.params.id as string,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject updated successfully.",
            subject
        )
    );
});

/**
 * Delete Subject
 */
export const deleteSubject = asyncHandler(async (req, res) => {
    await deleteSubjectService(req.params.id as string);

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject deleted successfully.",
            null
        )
    );
});