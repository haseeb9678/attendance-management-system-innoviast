export interface StudentClass {
    _id: string;
    name: string;
    code: string;
    description?: string;
    status: string;

    department?: {
        _id: string;
        name: string;
        code: string;
    } | null;
}

export interface StudentSubject {
    _id: string;

    subject: {
        _id: string;
        name: string;
        code: string;
        creditHours?: number;
    };

    department?: {
        _id: string;
        name: string;
        code: string;
    };

    instructor?: {
        _id: string;
        name: string;
        email: string;
    };
}

export interface StudentSession {
    _id: string;
    room: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;

    teacherAssignment: {
        _id: string;

        subject?: {
            _id: string;
            name: string;
            code: string;
        };

        class?: {
            _id: string;
            name: string;
            code: string;
        };

        department?: {
            _id: string;
            name: string;
            code: string;
        };

        instructor?: {
            _id: string;
            name: string;
            email: string;
        };
    };
}

export interface StudentAttendanceStats {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
}

export interface StudentAttendanceHistoryItem {
    _id: string;
    status: "present" | "absent" | "late" | "excused";
    createdAt: string;

    session: {
        _id: string;
        room: string;
        date: string;
        startTime: string;
        endTime: string;
        status: string;
    };

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
}

export interface StudentDashboardOverview {
    className: string | null;
    classCode: string | null;
    totalSubjects: number;
    totalSessions: number;
}

export interface StudentDashboardData {
    overview: StudentDashboardOverview;
    recentSessions: StudentSession[];
}