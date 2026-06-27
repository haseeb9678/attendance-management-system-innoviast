import type { SessionStatus } from "@attendance/shared-types";

export interface Session {
    _id: string;

    teacherAssignment: string;

    date: Date;

    startTime: string;
    endTime: string;

    room?: string;

    status: SessionStatus;

    createdAt: Date;
    updatedAt: Date;
}

export type SessionFilters = {
    page?: number;
    limit?: number;
    search?: string;
    teacherAssignment?: string;
    status?: SessionStatus;
    date?: string;
    sort?: "newest" | "oldest";
};