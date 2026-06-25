export type UserRole = "admin" | "instructor" | "student";

export type UserStatus =
    | "active"
    | "inactive"
    | "pending"
    | "suspended";

export interface User {
    id: string;

    name: string;
    email: string;

    profilePhoto?: string;

    role: UserRole;
    status: UserStatus;

    phone?: string;


    createdAt: string;
    updatedAt: string;
}