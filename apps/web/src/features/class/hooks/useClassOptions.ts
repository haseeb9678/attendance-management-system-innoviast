import { useMemo } from "react";
import { useClasses } from "./useClass";
import type { Class } from "../types/class.types";

interface UseClassOptionsProps {
    department?: string;
}

export const useClassOptions = ({
    department,
}: UseClassOptionsProps = {}) => {
    const query = useClasses({
        department,
        limit: 1000,
        status: "active",
    });

    const options = useMemo(() => {
        return (
            query.data?.data?.map((classItem: Class) => ({
                label: `${classItem.name} (${classItem.code})`,
                value: classItem._id,
                department: classItem.department?._id,
            })) ?? []
        );
    }, [query.data]);

    return {
        ...query,
        options,
    };
};