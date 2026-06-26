import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "@/features/admin/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import AddUser from "@/features/admin/pages/AddUser";
import Departments from "@/features/admin/pages/Departments";
import AddDepartment from "@/features/admin/pages/AddDepartment";

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
                path: "dashboard", element: <Dashboard />
            },
            {
                path: "users", element: <Users />
            },
            {
                path: "classes", element: <div>Classes</div>
            },
            {
                path: "users/add", element: <AddUser />
            },
            {
                path: "subjects", element: <div>Subjects</div>
            },
            {
                path: "departments", element: <Departments />
            },
            {
                path: "departments/add", element: <AddDepartment />

            },
            {
                path: "attendance", element: <div>Attendance</div>
            },

        ]
    }
])

export default router