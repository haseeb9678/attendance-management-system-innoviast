import { api } from "@/lib/axios";

import type {
    Session,
    SessionFilters,
} from "../types/session.types";

export const getSessions = async (
    filters: SessionFilters = {}
) => {
    const { data } = await api.get("/sessions", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            teacherAssignment: filters.teacherAssignment,
            status: filters.status,
            date: filters.date,
            sort: filters.sort,
        },
    });

    return data;
};

export const getSession = async (id: string) => {
    const { data } = await api.get<Session>(
        `/sessions/${id}`
    );

    return data;
};

export const createSession = async (body: {
    teacherAssignment: string;
    date: Date | string;
    startTime: string;
    endTime: string;
    room?: string;
    status?: string;
}) => {
    const { data } = await api.post(
        "/sessions",
        body
    );

    return data;
};

export const updateSession = async ({
    id,
    body,
}: {
    id: string;
    body: {
        teacherAssignment: string;
        date: Date | string;
        startTime: string;
        endTime: string;
        room?: string;
        status?: string;
    };
}) => {
    const { data } = await api.put(
        `/sessions/${id}`,
        body
    );

    return data;
};

export const deleteSession = async (id: string) => {
    const { data } = await api.delete(
        `/sessions/${id}`
    );

    return data;
};