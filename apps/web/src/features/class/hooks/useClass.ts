import { useQuery } from "@tanstack/react-query";
import { getClass, getClasses } from "../api/class.api.js";
import { classKeys } from "../api/class.keys.js";
import type { ClassFilters } from "../types/class.types";

export const useClasses = (
    filters: ClassFilters = {}
) => {
    return useQuery({
        queryKey: classKeys.list(filters),
        queryFn: () => getClasses(filters),
    });
};

export const useClass = (id: string) => {
    return useQuery({
        queryKey: classKeys.detail(id),
        queryFn: () => getClass(id),
    });
};