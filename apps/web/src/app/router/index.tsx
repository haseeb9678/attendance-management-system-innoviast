import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";

import { adminRoutes } from "./admin.routes";
import { instructorRoutes } from "./instructor.routes";
import { studentRoutes } from "./student.routes";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import StudentLayout from "../layouts/StudentLayout";

import ProtectedRoute from "../providers/ProtectedRoute";
import PublicRoute from "../providers/PublicRoute";
import ErrorPage from "../providers/ErrorPage";

const router = createBrowserRouter([
    /**
     * Public / Auth Routes
     */
    {
        element: <PublicRoute />,
        errorElement: (
            <ErrorPage
                statusCode={500}
                title="Authentication page error"
                description="Something went wrong while loading the authentication page."
            />
        ),
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
                    },
                ],
            },
        ],
    },

    /**
     * Admin Routes
     */
    {
        element: (
            <ProtectedRoute
                allowedRoles={["admin"]}
            />
        ),
        errorElement: (
            <ErrorPage
                statusCode={500}
                title="Admin page error"
                description="Something went wrong while loading the admin area."
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

    /**
     * Instructor Routes
     */
    {
        element: (
            <ProtectedRoute
                allowedRoles={["instructor"]}
            />
        ),
        errorElement: (
            <ErrorPage
                statusCode={500}
                title="Instructor page error"
                description="Something went wrong while loading the instructor area."
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

    /**
     * Student Routes
     */
    {
        element: (
            <ProtectedRoute
                allowedRoles={["student"]}
            />
        ),
        errorElement: (
            <ErrorPage
                statusCode={500}
                title="Student page error"
                description="Something went wrong while loading the student area."
            />
        ),
        children: [
            {
                path: "student",
                element: <StudentLayout />,
                children: studentRoutes,
            },
        ],
    },

    /**
     * Global 404 fallback
     */
    {
        path: "*",
        element: (
            <ErrorPage
                statusCode={404}
                title="Page not found"
                description="The page you’re trying to access doesn’t exist or may have been moved."
            />
        ),
    },
]);

export default router;