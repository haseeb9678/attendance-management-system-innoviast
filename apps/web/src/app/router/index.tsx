import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "@/features/admin/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import AddUser from "@/features/admin/pages/AddUser";
import Departments from "@/features/admin/pages/Departments";
import AddDepartment from "@/features/admin/pages/AddDepartment";
import Classess from "@/features/admin/pages/Classes";
import AddClass from "@/features/admin/pages/AddClass";
import Subjects from "@/features/admin/pages/Subjects";
import AddSubject from "@/features/admin/pages/AddSubject";

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
                path: "classes", element: <Classess />
            },
            {
                path: "classes/add", element: <AddClass />
            },
            {
                path: "users/add", element: <AddUser />
            },
            {
                path: "subjects", element: <Subjects />
            },
            {
                path: "subjects/add", element: <AddSubject />
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