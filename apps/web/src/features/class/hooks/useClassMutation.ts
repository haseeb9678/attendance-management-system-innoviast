import { useMutation } from "@tanstack/react-query";
import {
    createClass,
    deleteClass,
    updateClass,
} from "../api/class.api.js";
import { queryClient } from "@/lib/queryClient";
import { classKeys } from "../api/class.keys.js";

export const useCreateClass = () => {
    return useMutation({
        mutationFn: createClass,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: classKeys.all,
            });
        },
    });
};

export const useUpdateClass = () => {
    return useMutation({
        mutationFn: updateClass,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: classKeys.all,
            });
        },
    });
};

export const useDeleteClass = () => {
    return useMutation({
        mutationFn: deleteClass,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: classKeys.all,
            });
        },
    });
};