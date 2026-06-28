import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

const PublicRoute = () => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user) {
        switch (user.role) {
            case "admin":
                return (
                    <Navigate
                        to="/admin/dashboard"
                        replace
                    />
                );

            case "instructor":
                return (
                    <Navigate
                        to="/instructor/dashboard"
                        replace
                    />
                );

            case "student":
                return (
                    <Navigate
                        to="/student/dashboard"
                        replace
                    />
                );
        }
    }

    return <Outlet />;
};

export default PublicRoute;