import { useMemo } from "react";

import { useTeacherAssignments } from "./useTeacherAssignment";
import type { TeacherAssignment } from "../types/teacherAssignment.types";

export const useTeacherAssignmentOptions = () => {
    const query = useTeacherAssignments({
        limit: 1000,
        status: "active",
    });

    const options = useMemo(() => {
        return (
            query.data?.data?.map(
                (assignment: TeacherAssignment) => ({
                    label: `${assignment.subject?.name} • ${assignment.class?.name} (${assignment.class?.code}) • ${assignment.instructor?.name}`,
                    value: assignment._id,
                })
            ) ?? []
        );
    }, [query.data]);

    return {
        ...query,
        options,
    };
};