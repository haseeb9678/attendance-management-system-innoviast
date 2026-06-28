// ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
    allowedRoles?: (
        | "admin"
        | "instructor"
        | "student"
    )[];
}

const ProtectedRoute = ({
    allowedRoles,
}: Props) => {
    const { user, isAuthenticated } =
        useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user!.role)
    ) {
        console.log("not allowed");

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;