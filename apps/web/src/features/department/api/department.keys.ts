import type { DepartmentFilters } from "../types/department.types";

export const departmentKeys = {
    all: ["departments"] as const,

    lists: () => [...departmentKeys.all, "list"] as const,

    list: (filters: DepartmentFilters) =>
        [...departmentKeys.lists(), filters] as const,

    details: () => [...departmentKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...departmentKeys.details(), id] as const,
};