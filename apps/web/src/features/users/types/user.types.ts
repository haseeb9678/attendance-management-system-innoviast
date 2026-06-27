export type UserRole = "admin" | "instructor" | "student";

export type UserStatus =
    | "active"
    | "inactive"
    | "pending"
    | "suspended";

export interface User {
    _id: string;

    name: string;
    email: string;

    profilePhoto?: string;
    registrationNumber?: string;
    rollNumber?: string;
    employeeId?: string;
    department?: string;
    class?: string;


    role: UserRole;
    status: UserStatus;

    phone?: string;


    createdAt: string;
    updatedAt: string;
}

export interface UserFilters {
    page?: number;
    limit?: number;

    search?: string;

    role?: "admin" | "instructor" | "student";

    department?: string;

    class?: string;

    status?: "active" | "inactive";

    sort?: "newest" | "oldest";
}