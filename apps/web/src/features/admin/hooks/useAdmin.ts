import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "../api/admin.api.js";

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboardStats,
           refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};