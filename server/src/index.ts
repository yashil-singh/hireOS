import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";

// routes
import authRoutes from "@/routes/authRoutes";
import candidateRoutes from "@/routes/candidateRoutes";
import assessmentRoutes from "@/routes/assessmentRoutes";
import hiringProcessRoutes from "@/routes/hiringProcessRoutes";
import eventRoutes from "@/routes/eventRoutes";
import interviewerRoutes from "@/routes/interviewerRoutes";
import interviewRoutes from "@/routes/interviewRoutes";
import letterRoutes from "@/routes/letterRoutes";
import { seedHiringSteps } from "./controllers/hiringProcessController";
import { authenticate } from "./middlewares/authenticate";
import { seedDrafts, seedDraftVariables } from "./controllers/draftController";
import { getDashboardData } from "./controllers/dashboardController";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/candidates", authenticate, candidateRoutes);
app.use("/api/assessments", authenticate, assessmentRoutes);
app.use("/api/hiring-process", authenticate, hiringProcessRoutes);
app.use("/api/events", authenticate, eventRoutes);
app.use("/api/interviewers", authenticate, interviewerRoutes);
app.use("/api/calendar", authenticate, interviewRoutes);
app.use("/api/letters", authenticate, letterRoutes);
app.use("/api/dashboard", authenticate, getDashboardData);

connectDB();

const seed = async () => {
  await seedHiringSteps();
  await seedDraftVariables();
  await seedDrafts();
};

seed();

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
