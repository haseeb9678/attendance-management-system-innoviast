import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import errorMiddleware from "./middleware/error.middleware";

import helmet from "helmet";



const app = express();

// app.use(hpp());
app.use(helmet());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

//Routes
const api = "/api/v1"
app.use(`${api}/auth`, authRouter);

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Attendance Managment System API Running",
    });
});

//Global Error Middleware

app.use(errorMiddleware)

//Unhandled Rejection
process.on(
    "unhandledRejection",
    (reason) => {
        console.error(reason);
        process.exit(1);
    }
);


export default app;