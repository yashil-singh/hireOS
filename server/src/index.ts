import express, { Request, Response } from "express";
import authRoutes from "@/routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
