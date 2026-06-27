import { useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "../api/user.api.js";
import { userKeys } from "../api/user.keys.js";
import type { UserFilters } from "../types/user.types";

export const useUsers = (
    filters: UserFilters = {}
) => {
    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: () => getUsers(filters),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUser(id),
    });
};