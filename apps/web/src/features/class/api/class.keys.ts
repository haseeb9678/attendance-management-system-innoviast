import type { ClassFilters } from "../types/class.types";

export const classKeys = {
    all: ["classes"] as const,

    lists: () => [...classKeys.all, "list"] as const,

    list: (filters: ClassFilters) =>
        [...classKeys.lists(), filters] as const,

    details: () => [...classKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...classKeys.details(), id] as const,
};