import Dashboard from "@/features/student/pages/Dashboard";

export const studentRoutes = [
    {
        index: true,
        element: <Dashboard />,
    },
    {
        path: "dashboard",
        element: <Dashboard />,
    },

];