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
}