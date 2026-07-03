export const ATTENDANCE_STATUS = [
    "present",
    "absent",
    "late",
    "excused",
] as const;

export type AttendanceStatus =
    (typeof ATTENDANCE_STATUS)[number];