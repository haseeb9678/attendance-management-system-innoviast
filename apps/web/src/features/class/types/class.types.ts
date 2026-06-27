export interface Class {
    id: string;
    name: string;
    code: string;
    department: {
        id: string;
        name: string;
    };
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateClassInput {
    name: string;
    code: string;
    department: string;
    description?: string;
    status: "active" | "inactive";
}

export interface ClassFilters {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}