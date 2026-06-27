import { useMutation } from "@tanstack/react-query";
import {
    createUser,
    deleteUser,
    updateUser,
} from "../api/user.api.js";
import { queryClient } from "@/lib/queryClient";
import { userKeys } from "../api/user.keys.js";

export const useCreateUser = () => {
    return useMutation({
        mutationFn: createUser,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.all,
            });
        },
    });
};

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: updateUser,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.all,
            });
        },
    });
};

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: deleteUser,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.all,
            });
        },
    });
};