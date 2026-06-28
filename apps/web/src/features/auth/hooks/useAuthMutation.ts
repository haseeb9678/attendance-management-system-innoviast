import { useMutation } from "@tanstack/react-query";

import {
    login,
    logout,
    register,
} from "../api/auth.api";

import { authKeys } from "../api/auth.keys";

import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "../store/auth.store";

export const useLogin = () => {
    return useMutation({
        mutationFn: login,

        onSuccess: (response) => {
            const auth = useAuthStore.getState();

            auth.login({
                user: response.data,
                accessToken: response.meta.accessToken,
            });

            queryClient.setQueryData(
                authKeys.me(),
                response.data
            );
        }
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            const auth = useAuthStore.getState();

            auth.logout();

            queryClient.removeQueries({
                queryKey: authKeys.all,
            });

            queryClient.clear();
        },
    });
};