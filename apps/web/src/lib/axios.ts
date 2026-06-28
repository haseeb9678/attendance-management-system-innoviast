import { useAuthStore } from "@/features/auth/store/auth.store";
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token =
        useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isCancel(error))
            return Promise.reject(error);

        return Promise.reject({
            message: error.response?.data?.message || error?.message || "Something went wrong",
            status: error.response?.status,
        });

    }
)