import { api } from "@/lib/axios";

export const getAdminDashboardStats = async () => {
    const { data } = await api.get(
        "/admin/dashboard"
    );

    return data;

};

export const updateAdminProfile = async (data: any) => {
    const res = await api.put("/admin/profile", data);
    return res;
};