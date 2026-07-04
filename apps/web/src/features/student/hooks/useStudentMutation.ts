import { useMutation } from "@tanstack/react-query";
import { updateStudentProfile } from "../api/student.api";

export const useUpdateStudentProfile = () => {
    return useMutation({
        mutationFn: updateStudentProfile,
    });
};