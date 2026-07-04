import Dashboard from "@/features/student/pages/Dashboard";
import MyClass from "@/features/student/pages/MyClass";
import Subjects from "@/features/student/pages/Subjects";
import Sessions from "@/features/student/pages/Sessions";
import AttendanceHistory from "@/features/student/pages/AttendanceHistory";
import SubjectAttendanceInfo from "@/features/student/pages/SubjectAttendanceInfo";
import Profile from "@/features/student/pages/Profile";

export const studentRoutes = [
    {
        index: true,
        element: <Dashboard />,
    },
    {
        path: "dashboard",
        element: <Dashboard />,
    },
    {
        path: "class",
        element: <MyClass />,
    },
    {
        path: "subjects",
        element: <Subjects />,
    },
    {
        path: "sessions",
        element: <Sessions />,
    },
    {
        path: "attendance/history",
        element: <AttendanceHistory />,
    },
    {
        path: "attendance/history/subject/:subjectId",
        element: <SubjectAttendanceInfo />,
    },
    {
        path: "profile",
        element: <Profile />,
    }



];