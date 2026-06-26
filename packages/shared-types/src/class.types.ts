

export const CLASS_STATUS = ["active", "inactive"] as const;

export type ClassStatus = (typeof CLASS_STATUS)[number];