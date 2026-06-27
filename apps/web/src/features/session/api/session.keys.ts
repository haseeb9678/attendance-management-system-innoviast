import type { SessionFilters } from "../types/session.types";

export const sessionKeys = {
    all: ["sessions"] as const,

    lists: () => [...sessionKeys.all, "list"] as const,

    list: (filters: SessionFilters) =>
        [...sessionKeys.lists(), filters] as const,

    details: () => [...sessionKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...sessionKeys.details(), id] as const,
};