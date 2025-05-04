import { getHiringProcess } from "@/controllers/hiringProcessController";
import express from "express";

const router = express.Router();

router.get("/", getHiringProcess);

export default router;
