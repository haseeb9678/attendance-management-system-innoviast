import { useMutation } from "@tanstack/react-query";
import {
    createSubject,
    deleteSubject,
    updateSubject,
} from "../api/subject.api.js";
import { queryClient } from "@/lib/queryClient";
import { subjectKeys } from "../api/subject.keys.js";

export const useCreateSubject = () => {
    return useMutation({
        mutationFn: createSubject,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subjectKeys.all,
            });
        },
    });
};

export const useUpdateSubject = () => {
    return useMutation({
        mutationFn: updateSubject,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subjectKeys.all,
            });
        },
    });
};

export const useDeleteSubject = () => {
    return useMutation({
        mutationFn: deleteSubject,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subjectKeys.all,
            });
        },
    });
};