import { useMemo } from "react";
import { useSubjects } from "./useSubject.js";
import type { Subject } from "../types/subject.types.js";

interface UseSubjectOptionsProps {
    department?: string;
}

export const useSubjectOptions = ({
    department,
}: UseSubjectOptionsProps = {}) => {
    const query = useSubjects({
        department,
        limit: 1000,
        status: "active",
    });

    const options = useMemo(() => {
        return (
            query.data?.data?.map((subject: Subject) => ({
                label: subject.name,
                value: subject._id,
            })) ?? []
        );
    }, [query.data]);

    return {
        ...query,
        options,
    };
};