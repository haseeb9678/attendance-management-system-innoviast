// src/features/auth/api/auth.api.ts

import { api } from "@/lib/axios";

export interface LoginBody {
    email: string;
    password: string;
}

export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const login = async (
    body: LoginBody
) => {
    const { data } =
        await api.post<AuthResponse>(
            "/auth/login",
            body
        );

    return data;
};

export const register = async (
    body: RegisterBody
) => {
    const { data } =
        await api.post<User>(
            "/auth/register",
            body
        );

    return data;
};

export const getMe = async () => {
    const { data } =
        await api.get<User>(
            "/auth/me"
        );

    return data;
};

export const refresh = async (
) => {
    const { data } =
        await api.post<AuthResponse>(
            "/auth/refresh"
        );

    return data;
};

export const logout = async () => {
    const { data } =
        await api.post(
            "/auth/logout"
        );

    return data;
};