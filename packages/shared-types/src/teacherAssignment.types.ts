

export const ASSIGNMENT_STATUS = ["active", "inactive"] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUS)[number];