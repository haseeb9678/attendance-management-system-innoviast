
import { ATTENDANCE_STATUS } from "@attendance/shared-types";

export const roleOptions = [
    {
        label: "All Roles",
        value: ""
    },
    {
        label: "Student",
        value: "student"
    },
    {
        label: "Instructor",
        value: "instructor"
    },
    {
        label: "Admin",
        value: "admin"
    }
];

export const statusOptions = [
    {
        label: "All Status",
        value: ""
    },
    {
        label: "Active",
        value: "active"
    },
    {
        label: "Inactive",
        value: "inactive"
    }
];

export const sortOptions = [
    {
        label: "Newest",
        value: "newest"
    },
    {
        label: "Oldest",
        value: "oldest"
    }
];

export const limitOptions = [
    {
        label: "5",
        value: 5
    },
    {
        label: "10",
        value: 10
    },
    {
        label: "25",
        value: 25
    },
    {
        label: "50",
        value: 50
    },
]



export const attendanceStatusOptions = [
    {
        label: "All Status",
        value: ""
    },
    {
        label: "Present",
        value: ATTENDANCE_STATUS[0],
    },
    {
        label: "Absent",
        value: ATTENDANCE_STATUS[1],
    },
    {
        label: "Late",
        value: ATTENDANCE_STATUS[2],
    },
    {
        label: "Excused",
        value: ATTENDANCE_STATUS[3],
    },
];