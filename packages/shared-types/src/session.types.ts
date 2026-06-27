// shared/types/session.types.ts

export const DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const SESSION_STATUS = [
    "scheduled",
    "ongoing",
    "completed",
    "cancelled",
] as const;

export type SessionStatus =
    (typeof SESSION_STATUS)[number];