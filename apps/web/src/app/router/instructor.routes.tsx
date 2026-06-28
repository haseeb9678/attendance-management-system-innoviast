import InstructorDashboard from "@/features/instructor/pages/InstructorDashboard";

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
        element: <div>Subjects</div>,
    },
    {
        path: "classes",
        element: <div>Classes</div>,
    },
    {
        path: "sessions",
        element: <div>Sessions</div>,
    },
    {
        path: "attendance",
        element: <div>Attendance</div>,
    },
];