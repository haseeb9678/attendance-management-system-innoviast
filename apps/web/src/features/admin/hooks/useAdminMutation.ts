import { useMutation } from "@tanstack/react-query";
import {
    updateAdminProfile,
    updateUser,
} from "../api/admin.api";

export const useUpdateAdminProfile = () => {
    return useMutation({
        mutationFn: updateAdminProfile,
    });
};

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: updateUser,
    });
};