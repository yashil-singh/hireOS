import { isObjectId, successResponse, throwError } from "@/lib/utils";
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
  const { search } = req.query;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const interviewers = await Interviewer.find(query).sort({ createdAt: -1 });
  successResponse({ res, data: interviewers });
};

export const editInterivewer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!isObjectId(id)) return throwError(`Invalid interviewer ID - ${id}`);

  const interviewer = await Interviewer.findById(id);
  if (!interviewer) return throwError(`Interviewer - ${id} not found.`, 404);

  const existingEmail = await Interviewer.findOne({
    email,
    _id: { $ne: id },
  });

  if (existingEmail) {
    return throwError(
      `"${email}" is already associated to another interviewer.`,
      400
    );
  }

  interviewer.name = name;
  interviewer.email = email;
  interviewer.phone = phone;

  const updatedInterviewer = await interviewer.save();
  successResponse({
    res,
    message: "Interviewer updated.",
    data: updatedInterviewer,
  });
};
