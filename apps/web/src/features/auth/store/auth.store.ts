import axios from "axios";
import { LoginSchema } from "../schemas/login.schema";

export const login = async (payload: LoginSchema) => {
    const response = await axios.post("/api/v1/auth/login", payload, {
        withCredentials: true,
    });

    return response.data;
};
