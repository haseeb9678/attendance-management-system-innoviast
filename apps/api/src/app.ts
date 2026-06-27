import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

import helmet from "helmet";
import { CLIENT_URL } from "./config/env.js";
import departmentRouter from "./modules/department/department.routes.js";
import { connectDB } from "./config/database.js";
import classRouter from "./modules/class/class.routes.js";
import subjectRouter from "./modules/subject/subject.routes.js";
import userRouter from "./modules/users/user.routes.js";
import teacherAssignmentRouter from "./modules/teacherAssignment/teacherAssignment.routes.js";
import sessionRouter from "./modules/session/session.routes.js";



const app = express();

// app.use(hpp());
app.set("trust proxy", 1)
app.use(helmet());
app.use(
    cors({
        origin: CLIENT_URL,
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
app.use(`${api}/users`, userRouter)
app.use(`${api}/departments`, departmentRouter)
app.use(`${api}/classes`, classRouter)
app.use(`${api}/subjects`, subjectRouter)
app.use(`${api}/teacher-assignments`, teacherAssignmentRouter)
app.use(`${api}/sessions`, sessionRouter)

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Attendance Managment System API Running",
    });
});

//Global Error Middleware

app.use(errorMiddleware)

await connectDB();

//Unhandled Rejection
process.on(
    "unhandledRejection",
    (reason) => {
        console.error(reason);
        process.exit(1);
    }
);


export default app;