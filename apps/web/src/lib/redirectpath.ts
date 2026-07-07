import type { User } from "@/features/users/types/user.types";


export const getRedirectPathByRole = (
    isAuthenticated: boolean,
    user?: User | null
) => {
    if (!isAuthenticated || !user) {
        return "/login";
    }

    switch (user.role) {
        case "admin":
            return "/admin/dashboard";

        case "instructor":
            return "/instructor/dashboard";

        case "student":
            return "/student/dashboard";

        default:
            return "/login";
    }
};