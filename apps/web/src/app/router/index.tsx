import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "@/features/admin/pages/Dashboard";
import Users from "@/features/admin/pages/Users";

const router = createBrowserRouter([
    {
        path: "/", element: <AuthLayout />, children: [
            {
                index: true, element: <LoginPage />
            }
        ]
    },
    {
        path: "admin", element: <AdminLayout />, children: [
            {
                index: true, element: <Dashboard />
            },
            {
                path: "users", element: <Users />
            },
            {
                path: "classes", element: <div>Classes</div>
            }
        ]
    }
])

export default router