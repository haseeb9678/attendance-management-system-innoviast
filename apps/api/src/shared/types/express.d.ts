import type {
    JwtPayload,
} from "@attendance/shared-types";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export { };