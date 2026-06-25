import { UserRole } from "./user.types";

export interface JwtPayload {
    userId: string;
    role: UserRole;
}