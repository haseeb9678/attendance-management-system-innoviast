import { useMemo } from "react";
import { useUsers } from "./useUser.js";
import type { User, UserRole } from "../types/user.types.js";

interface UseUserOptionsProps {
    role?: UserRole;
    department?: string
}

export const useUserOptions = ({
    role,
    department
}: UseUserOptionsProps = {}) => {
    const query = useUsers({
        role,
        department,
        limit: 1000,
        status: "active",
    });

    const options = useMemo(() => {
        return (
            query.data?.data?.map((user: User) => ({
                label: user.name,
                value: user._id,
                department: user.department?._id,
            })) ?? []
        );
    }, [query.data]);

    return {
        ...query,
        options,
    };
};