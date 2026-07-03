import InstructorClasses from "@/features/instructor/pages/InstructorClasses";
import InstructorClassInfo from "@/features/instructor/pages/InstructorClassInfo";
import InstructorDashboard from "@/features/instructor/pages/InstructorDashboard";
import InstructorMarkAttendance from "@/features/instructor/pages/InstructorMarkAttendance";
import InstructorProfile from "@/features/instructor/pages/InstructorProfile";
import InstructorSessions from "@/features/instructor/pages/InstructorSessions";
import InstructorSubjects from "@/features/instructor/pages/InstructorSubjects";
import InstructorAttendanceHistory from "@/features/instructor/pages/InstrunctorAttendanceHistory";

export const instructorRoutes = [
    {
        index: true,
        element: <InstructorDashboard />,
    },
    {
        path: "dashboard",
        element: <InstructorDashboard />,
    },
    {
        path: "subjects",
        element: <InstructorSubjects />,
    },
    {
        path: "classes",
        element: <InstructorClasses />
    },
    {
        path: "classes/:id/students",
        element: <InstructorClassInfo />
    },
    {
        path: "sessions",
        element: <InstructorSessions />,
    },
    {
        path: "sessions/:id/attendance",
        element: <InstructorMarkAttendance />,
    },
    {
        path: "profile",
        element: <InstructorProfile />,
    },
    {
        path: "attendance/history",
        element: <InstructorAttendanceHistory />,
    },
];