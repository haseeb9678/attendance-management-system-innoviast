import InstructorClasses from "@/features/instructor/pages/InstructorClasses";
import InstructorDashboard from "@/features/instructor/pages/InstructorDashboard";
import InstructorSessions from "@/features/instructor/pages/InstructorSessions";
import InstructorSubjects from "@/features/instructor/pages/InstructorSubjects";

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
        path: "sessions",
        element: <InstructorSessions />,
    },
    {
        path: "attendance",
        element: <div>Attendance</div>,
    },
];