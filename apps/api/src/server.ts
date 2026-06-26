import app from "./app.js";
import { PORT } from "./config/env.js";


const startServer = async () => {
    try {

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