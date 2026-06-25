import { config } from "dotenv";
import { z } from "zod";

config({
    path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number(),
    MONGODB_URI: z.string(),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),
    ACCESS_COOKIE_MAX_AGE: z.coerce.number(),
    REFRESH_COOKIE_MAX_AGE: z.coerce.number()
});

const env = envSchema.parse(process.env);

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    ACCESS_COOKIE_MAX_AGE,
    REFRESH_COOKIE_MAX_AGE,


} = env;