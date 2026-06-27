import { api } from "@/lib/axios";
import type {
    Class,
    ClassFilters,
    CreateClassInput,
} from "../types/class.types";

export const getClasses = async (filters: ClassFilters = {}) => {
    const { data } = await api.get("/classes", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            department: filters.department,
            status: filters.status,
            sort: filters.sort,
        },
    });

    return data;
};

export const getClass = async (id: string) => {
    const { data } = await api.get<Class>(`/classes/${id}`);
    return data;
};

export const createClass = async (
    body: CreateClassInput
) => {
    const { data } = await api.post("/classes", body);
    return data;
};

export const updateClass = async ({
    id,
    body,
}: {
    id: string;
    body: CreateClassInput;
}) => {
    const { data } = await api.put(
        `/classes/${id}`,
        body
    );

    return data;
};

export const deleteClass = async (id: string) => {
    const { data } = await api.delete(`/classes/${id}`);
    return data;
};