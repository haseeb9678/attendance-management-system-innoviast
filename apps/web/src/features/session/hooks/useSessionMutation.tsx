import { useMutation } from "@tanstack/react-query";

import {
    createSession,
    deleteSession,
    updateSession,
} from "../api/session.api.js";

import { queryClient } from "@/lib/queryClient";
import { sessionKeys } from "../api/session.keys.js";

export const useCreateSession = () => {
    return useMutation({
        mutationFn: createSession,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sessionKeys.all,
            });
        },
    });
};

export const useUpdateSession = () => {
    return useMutation({
        mutationFn: updateSession,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sessionKeys.all,
            });
        },
    });
};

export const useDeleteSession = () => {
    return useMutation({
        mutationFn: deleteSession,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sessionKeys.all,
            });
        },
    });
};