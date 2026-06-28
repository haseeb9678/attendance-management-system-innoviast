import { api } from "@/lib/axios";

export const getMyClasses = async () => {
    const { data } = await api.get("/instructor/classes");
    return data;
};

export const getMySubjects = async () => {
    const { data } = await api.get("/instructor/subjects");
    return data;
};

export const getMySessions = async () => {
    const { data } = await api.get("/instructor/sessions");
    return data;
};

export const getMyStudents = async (classId: string) => {
    const { data } = await api.get(
        `/instructor/students/${classId}`
    );

    return data;
};