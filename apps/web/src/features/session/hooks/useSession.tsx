import { useQuery } from "@tanstack/react-query";

import {
    getSession,
    getSessions,
} from "../api/session.api.js";
import { sessionKeys } from "../api/session.keys.js";

import type { SessionFilters } from "../types/session.types";

export const useSessions = (
    filters: SessionFilters = {}
) => {
    return useQuery({
        queryKey: sessionKeys.list(filters),
        queryFn: () => getSessions(filters),
    });
};

export const useSession = (id: string) => {
    return useQuery({
        queryKey: sessionKeys.detail(id),
        queryFn: () => getSession(id),
        enabled: !!id,
    });
};