import { useMutation } from "@tanstack/react-query";
import {
    createDepartment
    , deleteDepartment,
    updateDepartment
} from "../api/department.api.js";
import { queryClient } from "@/lib/queryClient";
import { departmentKeys } from "../api/department.keys.js";

export const useCreateDepartment = () => {
    return useMutation({
        mutationFn: createDepartment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: departmentKeys.all,
            });
        },
    });
};

export const useUpdateDepartment = () => {
    return useMutation({
        mutationFn: updateDepartment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: departmentKeys.all
            });
        },
    });
};

export const useDeleteDepartment = () => {
    return useMutation({
        mutationFn: deleteDepartment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: departmentKeys.all,
            });
        },
    });
};