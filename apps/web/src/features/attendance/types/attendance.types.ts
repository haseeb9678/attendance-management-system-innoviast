export interface Attendance {
    _id: string;

    session: {
        _id: string;
        date: string;
        startTime: string;
        endTime: string;
        room?: string;

        teacherAssignment: {
            subject: {
                _id: string;
                name: string;
                code: string;
            };

            class: {
                _id: string;
                name: string;
                code: string;
            };

            department: {
                _id: string;
                name: string;
                code: string;
            };
        };
    };

    student: {
        _id: string;
        name: string;
        registrationNumber: string;
        rollNumber: string;
    };

    status: "present" | "absent" | "late" | "excused";

    remarks?: string;

    markedAt: string;

    createdAt: string;
    updatedAt: string;
}

export interface AttendanceStudentInput {
    student: string;
    status: "present" | "absent" | "late" | "excused";
    remarks?: string;
}

export interface CreateAttendanceInput {
    session: string;
    students: AttendanceStudentInput[];
}

export interface AttendanceTableRow
    extends AttendanceStudentInput {

    _id: string;

    name: string;

    rollNumber: string;

    registrationNumber: string;
}

export interface AttendanceHistoryFilters {
    page?: number;
    limit?: number;
    search?: string;

    class?: string;
    subject?: string;

    status?: "completed" | "pending";

    sort?: "newest" | "oldest";
}

export interface AttendanceHistory {
    _id: string;

    date: Date;

    startTime: string;

    endTime: string;

    room?: string;

    subject: {
        _id: string;
        name: string;
        code: string;
    };

    class: {
        _id: string;
        name: string;
        code: string;
    };

    department: {
        _id: string;
        name: string;
        code: string;
    };

    attendanceStatus:
    | "completed"
    | "pending";

    present: number;

    absent: number;

    late: number;

    excused: number;

    totalMarked: number;
}