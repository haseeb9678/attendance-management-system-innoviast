import { api } from "@/lib/axios";
import type {
    User,
    UserFilters,
} from "../types/user.types";
import type { CreateUserInput } from "@attendance/shared-zod";

export const getUsers = async (
    filters: UserFilters = {}
) => {
    const { data } = await api.get("/users", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            role: filters.role,
            department: filters.department,
            class: filters.class,
            status: filters.status,
            sort: filters.sort,
        },
    });

    return data;
};

export const getUser = async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
};

export const createUser = async (
    body: CreateUserInput
) => {
    const { data } = await api.post("/users", body);
    return data;
};

export const updateUser = async ({
    id,
    body,
}: {
    id: string;
    body: CreateUserInput;
}) => {
    const { data } = await api.put(
        `/users/${id}`,
        body
    );

    return data;
};

export const updatePassword = async ({
    body
}: {

    body: string;
}) => {
    const { data } = await api.patch(
        `/users/change-password`,
        body
    );

    return data;
};

export const deleteUser = async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
};