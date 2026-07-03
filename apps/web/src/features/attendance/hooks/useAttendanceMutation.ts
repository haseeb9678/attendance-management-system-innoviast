import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";

import {
    createAttendance,
    updateAttendance,
    deleteAttendance,
} from "../api/attendance.api";

import { attendanceKeys } from "../api/attendance.keys";

export const useCreateAttendance = () => {
    return useMutation({
        mutationFn: createAttendance,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: attendanceKeys.session(
                    variables.session
                ),
            });
        },
    });
};

export const useUpdateAttendance = () => {
    return useMutation({
        mutationFn: updateAttendance,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: attendanceKeys.session(
                    variables.sessionId
                ),
            });
        },
    });
};

export const useDeleteAttendance = () => {
    return useMutation({
        mutationFn: deleteAttendance,

        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({
                queryKey: attendanceKeys.session(
                    sessionId
                ),
            });
        },
    });
};