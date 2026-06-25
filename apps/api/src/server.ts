import app from "./app.js";
import { connectDB } from "./config/database.js";
import { PORT } from "./config/env.js";


const startServer = async () => {
    try {
        await connectDB();



        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });


    } catch (error) {
        console.error("Failed to start application");
        process.exit(1);
    }
};

startServer();