import { useQuery } from "@tanstack/react-query";
import { getDepartment, getDepartments } from "../api/department.api.js";
import { departmentKeys } from "../api/department.keys.js";
import type { DepartmentFilters } from "../types/department.types";

export const useDepartments = (
    filters: DepartmentFilters = {}
) => {
    return useQuery({
        queryKey: departmentKeys.list(filters),
        queryFn: () => getDepartments(filters),
    });
};

export const useDepartment = (id: string) => {
    return useQuery({
        queryKey: departmentKeys.detail(id),
        queryFn: () => getDepartment(id),
    });
};