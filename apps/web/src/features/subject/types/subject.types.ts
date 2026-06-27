export interface Subject {
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


export interface SubjectFilters {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: "active" | "inactive";
    sort?: "newest" | "oldest";
}