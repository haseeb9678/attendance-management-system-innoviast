import { useMutation } from "@tanstack/react-query";
import {
    createTeacherAssignment,
    deleteTeacherAssignment,
    updateTeacherAssignment,
} from "../api/teacherAssignment.api.js";
import { queryClient } from "@/lib/queryClient";
import { teacherAssignmentKeys } from "../api/teacherAssignment.keys.js";

export const useCreateTeacherAssignment = () => {
    return useMutation({
        mutationFn: createTeacherAssignment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teacherAssignmentKeys.all,
            });
        },
    });
};

export const useUpdateTeacherAssignment = () => {
    return useMutation({
        mutationFn: updateTeacherAssignment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teacherAssignmentKeys.all,
            });
        },
    });
};

export const useDeleteTeacherAssignment = () => {
    return useMutation({
        mutationFn: deleteTeacherAssignment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teacherAssignmentKeys.all,
            });
        },
    });
};