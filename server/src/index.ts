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
app.use("/api/candidates", candidateRoutes);
app.use("/api/assessments", assessmentRoutes);

connectDB();

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
