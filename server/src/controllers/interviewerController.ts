import { successResponse, throwError } from "@/lib/utils";
import Interviewer from "@/models/Interviewer";
import { Request, Response } from "express";

export const createInterviewer = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  const existingInterviewer = await Interviewer.findOne({ email });

  if (existingInterviewer)
    return throwError(
      `Interviewer assocciated with '${email}' already exists.`
    );

  const interviewer = new Interviewer({
    name,
    email,
    phone,
  });

  const newInterviewer = interviewer.save();
  successResponse({
    res,
    message: "Interviewer created.",
    data: newInterviewer,
  });
};

export const getAllInterviewers = async (req: Request, res: Response) => {
  const interviewers = await Interviewer.find().sort({ createdAt: -1 });
  successResponse({ res, data: interviewers });
};
