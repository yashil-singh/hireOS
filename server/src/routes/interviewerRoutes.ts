import {
  createInterviewer,
  getAllInterviewers,
} from "@/controllers/interviewerController";
import { interviwerSchema } from "@/lib/schemas/interviewerSchemas";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.post("/", validateData(interviwerSchema), createInterviewer);

router.get("/", getAllInterviewers);

export default router;
