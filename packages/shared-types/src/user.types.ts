export const USER_ROLE = {
    ADMIN: "admin",
    INSTRUCTOR: "instructor",
    STUDENT: "student",
} as const;



export const USER_ROLES = Object.values(USER_ROLE);
export const USER_STATUS = ["active", "inactive"] as const;


export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUS)[number];