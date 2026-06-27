import { useMemo } from "react";
import { useDepartments } from "./useDepartment.js";
import type { Department } from "../types/department.types.js";

export const useDepartmentOptions = () => {
    const query = useDepartments({
        limit: 1000,
        status: "active",
    });

    const options = useMemo(() => {
        return (
            query.data?.data?.map((department: Department) => ({
                label: department.name,
                value: department._id,
            })) ?? []
        );
    }, [query.data]);

    return {
        ...query,
        options,
    };
};