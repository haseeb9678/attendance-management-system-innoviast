export interface InstructorOption {
    _id: string;
    name: string;
    employeeId: string;
}
export interface DepartmentOption {
    _id: string;
    name: string;
    employeeId: string;
}

export interface ClassOption {
    _id: string;
    name: string;
    code: string;
}

export interface SubjectOption {
    _id: string;
    name: string;
    code: string;
}

export type TeacherAssignmentStatus =
    | "active"
    | "inactive";

export interface TeacherAssignment {
    _id: string;

    department: DepartmentOption;


    instructor: InstructorOption;

    class: ClassOption;

    subject: SubjectOption;

    status: TeacherAssignmentStatus;

    createdAt: Date;
    updatedAt: Date;
}

export interface TeacherAssignmentFilters {
    page?: number;
    limit?: number;

    search?: string;

    department?: string;

    instructor?: string;
    class?: string;
    subject?: string;

    status?: TeacherAssignmentStatus;

    sort?: "newest" | "oldest";
}