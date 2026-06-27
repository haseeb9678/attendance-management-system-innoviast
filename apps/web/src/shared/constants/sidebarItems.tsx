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
                        label: "Mark Attendance",
                        href: "/admin/attendance/mark",
                    },
                    {
                        id: 2,
                        label: "Attendance History",
                        href: "/admin/attendance/history",
                    },
                    {
                        id: 3,
                        label: "Leave Requests",
                        href: "/admin/attendance/leaves",
                    },
                    {
                        id: 4,
                        label: "Reports",
                        href: "/admin/attendance/reports",
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
                id: 8,
                label: "Roles & Permissions",
                Icon: ShieldCheck,
                href: "/admin/roles",
                children: [],
            },
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