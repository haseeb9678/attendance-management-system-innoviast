import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";

import { adminRoutes } from "./admin.routes";
import { instructorRoutes } from "./instructor.routes";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../providers/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import PublicRoute from "../providers/PublicRoute";
import StudentLayout from "../layouts/StudentLayout";
import { studentRoutes } from "./student.routes";

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/",
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <LoginPage />,
                    },
                    {
                        path: "login",
                        element: <LoginPage />,
                    }
                ],
            },
        ],
    },

    {
        element: (
            <ProtectedRoute
                allowedRoles={["admin"]}
            />
        ),
        children: [
            {
                path: "admin",
                element: <AdminLayout />,
                children: adminRoutes,
            },
        ],
    },

    {
        element: (
            <ProtectedRoute
                allowedRoles={["instructor"]}
            />
        ),
        children: [
            {
                path: "instructor",
                element: <InstructorLayout />,
                children: instructorRoutes,
            },
        ],
    },
    {
        element: (
            <ProtectedRoute
                allowedRoles={["student"]}
            />
        ),
        children: [
            {
                path: "student",
                element: <StudentLayout />,
                children: studentRoutes,
            },
        ],
    }
]);

export default router;