export const studentKeys = {
    all: ["student"] as const,

    dashboard: () =>
        [...studentKeys.all, "dashboard"] as const,

    class: () =>
        [...studentKeys.all, "class"] as const,

    subjects: () =>
        [...studentKeys.all, "subjects"] as const,

    sessions: () =>
        [...studentKeys.all, "sessions"] as const,

    attendance: () =>
        [...studentKeys.all, "attendance"] as const,

    attendanceHistory: ({
        search,
        sort,
    }: {
        search?: string;
        sort?: "newest" | "oldest";
    }) =>
        [
            ...studentKeys.attendance(),
            "history",
            search,
            sort,
        ] as const,

    attendanceSubjectDetails: ({
        subjectId,
        page,
        limit,
        search,
        sort,
    }: {
        subjectId: string;
        page?: number;
        limit?: number;
        search?: string;
        sort?: "newest" | "oldest";
    }) =>
        [
            ...studentKeys.attendance(),
            "subject-details",
            subjectId,
            page,
            limit,
            search,
            sort,
        ] as const,
};