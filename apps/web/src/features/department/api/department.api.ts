import { api } from "@/lib/axios";
import type { Department } from "../types/department.types.js";
import type { DepartmentFilters } from "../types/department.types";

export const getDepartments = async (filters: DepartmentFilters = {}) => {
    const { data } = await api.get("/departments", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            status: filters.status,
            sort: filters.sort,
        },
    });

    return data;
};

export const getDepartment = async (id: string) => {
    const { data } = await api.get(`/departments/${id}`);
    return data.data as Department;
}

export const createDepartment = async (body: {
    name: string;
}) => {
    const { data } = await api.post("/departments", body);
    return data;
};

export const updateDepartment = async ({
    id,
    body,
}: {
    id: string;
    body: {
        name: string;
    };
}) => {
    const { data } = await api.put(`/departments/${id}`, body);
    return data;
};

export const deleteDepartment = async (id: string) => {
    const { data } = await api.delete(`/departments/${id}`);
    return data;
};