export const instructorKeys = {
    all: ["instructor"] as const,

    classes: () =>
        [...instructorKeys.all, "classes"] as const,

    subjects: () =>
        [...instructorKeys.all, "subjects"] as const,

    sessions: () =>
        [...instructorKeys.all, "sessions"] as const,

    students: () =>
        [...instructorKeys.all, "students"] as const,

    studentsByClass: (classId: string) =>
        [...instructorKeys.students(), classId] as const,

    classOverview: ({
        classId,
        page,
        limit,
        search,
        sort,
    }: {
        classId: string;
        page: number;
        limit: number;
        search: string;
        sort: "newest" | "oldest";
    }) =>
        [
            ...instructorKeys.all,
            "class-overview",
            classId,
            page,
            limit,
            search,
            sort,
        ] as const,
};