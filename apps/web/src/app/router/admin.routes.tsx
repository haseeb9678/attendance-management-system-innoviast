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
import UpdateDepartment from "@/features/admin/pages/update/UpdateDepartment";
import ViewDepartment from "@/features/admin/pages/view/ViewDepartment";
import ViewUser from "@/features/admin/pages/view/ViewUser";
import UpdateClass from "@/features/admin/pages/update/UpdateClass";
import ViewClass from "@/features/admin/pages/view/ViewClass";
import UpdateSubject from "@/features/admin/pages/update/UpdateSubject";
import ViewSubject from "@/features/admin/pages/view/ViewSubject";
import UpdateTeacherAssignment from "@/features/admin/pages/update/UpdateTeacherAssignment";
import ViewTeacherAssignment from "@/features/admin/pages/view/ViewTeacherAsignment";

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
        path: "users/:id/info",
        element: <ViewUser />,
    },
    {
        path: "departments",
        element: <Departments />,
    },
    {
        path: "departments/:id/update",
        element: <UpdateDepartment />,
    },
    {
        path: "departments/:id/info",
        element: <ViewDepartment />,
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
        path: "classes/:id/update",
        element: <UpdateClass />,
    },
    {
        path: "classes/:id/info",
        element: <ViewClass />,
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
        path: "subjects/:id/update",
        element: <UpdateSubject />,
    },
    {
        path: "subjects/:id/info",
        element: <ViewSubject />,
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
        path: "teacher-assignments/:id/update",
        element: <UpdateTeacherAssignment />,
    },
    {
        path: "teacher-assignments/:id/info",
        element: <ViewTeacherAssignment />,
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