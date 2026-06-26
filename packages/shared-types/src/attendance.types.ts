export const ATTENDANCE_STATUSES = [
    "present",
    "absent",
    "late",
] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];