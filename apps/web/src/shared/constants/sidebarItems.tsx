import {
    BarChart3,
    BookOpen,
    ClipboardCheck,
    GraduationCap,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    UserCog,
    Users,
    Building2,
    UserCheck,
    CalendarClock,
} from "lucide-react";

export const adminSidebarItems = [
    {
        id: 1,
        label: "Menu",
        items: [
            {
                id: 1,
                label: "Dashboard",
                Icon: LayoutDashboard,
                href: "/admin/dashboard",
                children: [],
            },
        ],
    },

    {
        id: 2,
        label: "Management",
        items: [
            {
                id: 2,
                label: "Users",
                Icon: Users,
                href: "/admin/users",
                children: [],
            },
            {
                id: 3,
                label: "Departments",
                Icon: Building2,
                href: "/admin/departments",
                children: [],
            },
            {
                id: 4,
                label: "Classes",
                Icon: GraduationCap,
                href: "/admin/classes",
                children: [],
            },
            {
                id: 5,
                label: "Subjects",
                Icon: BookOpen,
                href: "/admin/subjects",
                children: [],
            },
            {
                id: 6,
                label: "Teacher Assignmets",
                Icon: UserCheck,
                href: "/admin/teacher-assignments",
                children: [],
            },

            {
                id: 7,
                label: "Sessions",
                Icon: CalendarClock,
                href: "/admin/sessions",
                children: [],
            },

        ],
    },

    {
        id: 3,
        label: "Attendance",
        items: [
            {
                id: 6,
                label: "Attendance",
                Icon: ClipboardCheck,
                href: "/admin/attendance",
                children: [

                    {
                        id: 1,
                        label: "Attendance History",
                        href: "/admin/attendance/history",
                    },

                ],
            },
        ],
    },

    {
        id: 4,
        label: "Reports",
        items: [
            {
                id: 7,
                label: "Analytics",
                Icon: BarChart3,
                href: "/admin/reports",
                children: [],
            },
        ],
    },

    {
        id: 5,
        label: "Administration",
        items: [
            {
                id: 9,
                label: "Profile",
                Icon: UserCog,
                href: "/admin/profile",
                children: [],
            },
            {
                id: 10,
                label: "Settings",
                Icon: Settings,
                href: "/admin/settings",
                children: [],
            },
        ],
    },
];

export const instructorSidebarItems = [
    {
        id: 1,
        label: "Menu",
        items: [
            {
                id: 1,
                label: "Dashboard",
                Icon: LayoutDashboard,
                href: "/instructor/dashboard",
                children: [],
            },
        ],
    },

    {
        id: 2,
        label: "Teaching",
        items: [
            {
                id: 2,
                label: "My Subjects",
                Icon: BookOpen,
                href: "/instructor/subjects",
                children: [],
            },
            {
                id: 3,
                label: "My Classes",
                Icon: GraduationCap,
                href: "/instructor/classes",
                children: [],
            },
            {
                id: 4,
                label: "My Sessions",
                Icon: CalendarClock,
                href: "/instructor/sessions",
                children: [],
            },
        ],
    },

    {
        id: 3,
        label: "Attendance",
        items: [
            {
                id: 5,
                label: "Attendance",
                Icon: ClipboardCheck,
                href: "/instructor/attendance",
                children: [

                    {
                        id: 1,
                        label: "Attendance History",
                        href: "/instructor/attendance/history",
                    },
                ],
            },
        ],
    },

    {
        id: 4,
        label: "Account",
        items: [
            {
                id: 7,
                label: "Profile",
                Icon: UserCog,
                href: "/instructor/profile",
                children: [],
            },

        ],
    },
];


export const studentSidebarItems = [
    {
        id: 1,
        label: "Menu",
        items: [
            {
                id: 1,
                label: "Dashboard",
                Icon: LayoutDashboard,
                href: "/student/dashboard",
                children: [],
            },
        ],
    },

    {
        id: 2,
        label: "Learning",
        items: [
            {
                id: 2,
                label: "My Class",
                Icon: GraduationCap,
                href: "/student/class",
                children: [],
            },
            {
                id: 3,
                label: "My Subjects",
                Icon: BookOpen,
                href: "/student/subjects",
                children: [],
            },
            {
                id: 4,
                label: "My Sessions",
                Icon: CalendarClock,
                href: "/student/sessions",
                children: [],
            },
        ],
    },

    {
        id: 3,
        label: "Attendance",
        items: [
            {
                id: 5,
                label: "Attendance",
                Icon: ClipboardCheck,
                href: "/student/attendance",
                children: [
                    {
                        id: 1,
                        label: "Attendance History",
                        href: "/student/attendance/history",
                    },
                ],
            },
        ],
    },

    {
        id: 4,
        label: "Account",
        items: [
            {
                id: 6,
                label: "Profile",
                Icon: UserCog,
                href: "/student/profile",
                children: [],
            },
        ],
    },
];