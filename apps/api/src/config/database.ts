import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "./env.js";

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached!.conn) {
        return cached!.conn;
    }

    try {
        if (!cached!.promise) {
            cached!.promise = mongoose.connect(MONGODB_URI, {
                bufferCommands: false,
            });
        }

        cached!.conn = await cached!.promise;

        console.log(`Database Connected, ${NODE_ENV} mode`);

        return cached!.conn;
    } catch (error: unknown) {
        cached!.promise = null;

        if (error instanceof Error) {
            console.error(`Database Connection Failed, ${error.message}`);
        }

        throw error;
    }
};