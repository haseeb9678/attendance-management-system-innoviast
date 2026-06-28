import Dashboard from "@/features/admin/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import AddUser from "@/features/admin/pages/AddUser";
import Departments from "@/features/admin/pages/Departments";
import AddDepartment from "@/features/admin/pages/AddDepartment";
import Classes from "@/features/admin/pages/Classes";
import AddClass from "@/features/admin/pages/AddClass";
import Subjects from "@/features/admin/pages/Subjects";
import AddSubject from "@/features/admin/pages/AddSubject";
import TeacherAssignments from "@/features/admin/pages/TeacherAssignments";
import AddTeacherAssignment from "@/features/admin/pages/AddTeacherAssignment";
import Sessions from "@/features/admin/pages/Sessions";
import AddSession from "@/features/admin/pages/AddSession";

export const adminRoutes = [
    {
        index: true,
        element: <Dashboard />,
    },
    {
        path: "dashboard",
        element: <Dashboard />,
    },
    {
        path: "users",
        element: <Users />,
    },
    {
        path: "users/add",
        element: <AddUser />,
    },
    {
        path: "departments",
        element: <Departments />,
    },
    {
        path: "departments/add",
        element: <AddDepartment />,
    },
    {
        path: "classes",
        element: <Classes />,
    },
    {
        path: "classes/add",
        element: <AddClass />,
    },
    {
        path: "subjects",
        element: <Subjects />,
    },
    {
        path: "subjects/add",
        element: <AddSubject />,
    },
    {
        path: "teacher-assignments",
        element: <TeacherAssignments />,
    },
    {
        path: "teacher-assignments/add",
        element: <AddTeacherAssignment />,
    },
    {
        path: "sessions",
        element: <Sessions />,
    },
    {
        path: "sessions/add",
        element: <AddSession />,
    },
];