import {
    CalendarClock,
    LayoutDashboard,
    LogOut,
    User,
} from "lucide-react";

export const adminHeaderMenuItems = [
    {
        id: 1,
        label: "Dashboard",
        href: "/admin/dashboard",
        Icon: LayoutDashboard,
    },
    {
        id: 2,
        label: "Profile",
        href: "/admin/profile",
        Icon: User,
    },
    {
        id: 3,
        label: "Sessions",
        href: "/admin/sessions",
        Icon: CalendarClock,

    },

    {
        id: 4,
        label: "Logout",
        Icon: LogOut,
        type: "action",
        action: "logout",
        danger: true,
    },
] as const;

export const instructorHeaderMenuItems = [
    {
        id: 1,
        label: "Dashboard",
        href: "/instructor/dashboard",
        Icon: LayoutDashboard,
    },
    {
        id: 2,
        label: "Profile",
        href: "/instructor/profile",
        Icon: User,
    },

    {
        id: 3,
        label: "Sessions",
        href: "/instructor/sessions",
        Icon: CalendarClock,

    },

    {
        id: 4,
        label: "Logout",
        Icon: LogOut,
        type: "action",
        action: "logout",
        danger: true,
    },
] as const;

export const studentHeaderMenuItems = [
    {
        id: 1,
        label: "Dashboard",
        href: "/student/dashboard",
        Icon: LayoutDashboard,
    },
    {
        id: 2,
        label: "Profile",
        href: "/student/profile",
        Icon: User,
    },

    {
        id: 3,
        label: "Sessions",
        href: "/student/sessions",
        Icon: CalendarClock,

    },

    {
        id: 4,
        label: "Logout",
        Icon: LogOut,
        type: "action",
        action: "logout",
        danger: true,
    },
] as const;