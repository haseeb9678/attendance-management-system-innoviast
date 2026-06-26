export const DEPARTMENT_STATUS = ["active", "inactive"] as const;

export type DepartmentStatus = (typeof DEPARTMENT_STATUS)[number];