export interface Department {
    _id: string;
    name: string;
    code: string;
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export type DepartmentFilters = {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
};