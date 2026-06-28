// auth.store.ts

import { create } from "zustand";

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "instructor" | "student";
}

interface AuthState {
    user: User | null;
    accessToken: string | null;

    isAuthenticated: boolean;

    isInitializing: boolean;

    login: (data: {
        user: User;
        accessToken: string;
    }) => void;

    logout: () => void;

    finishInitialization: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,

    isAuthenticated: false,

    isInitializing: true,

    login: ({ user, accessToken }) =>
        set({
            user,
            accessToken,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        }),

    finishInitialization: () =>
        set({
            isInitializing: false,
        }),
}));