import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "./env";


export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log(`Database Connected, ${NODE_ENV} mode`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Database Connection Failed, ${error.message}`);
        }

        process.exit(1);
    }
};