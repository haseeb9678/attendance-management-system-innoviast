export const SUBJECT_STATUS = ["active", "inactive"] as const;

export type SubjectStatus = (typeof SUBJECT_STATUS)[number];