import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

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
                index: true, element: <LoginPage />
            }
        ]
    }
])

export default router