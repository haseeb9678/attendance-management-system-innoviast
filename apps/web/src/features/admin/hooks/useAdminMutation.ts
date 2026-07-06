import { useMutation } from "@tanstack/react-query";
import { updateAdminProfile } from "../api/admin.api";

export const useUpdateAdminProfile = () => {
    return useMutation({
        mutationFn: updateAdminProfile,
    });
};
