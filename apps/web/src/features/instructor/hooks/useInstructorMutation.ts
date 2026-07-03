import { useMutation } from "@tanstack/react-query";
import { updateInstructorProfile } from "../api/instructor.api";

export const useUpdateInstructorProfile = () => {
    return useMutation({
        mutationFn: updateInstructorProfile,
    });
};
