import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Assessment from "@/models/Assessment";
import Candidate from "@/models/Candidate";
import { Request, Response } from "express";

export const createAssessment = async (req: Request, res: Response) => {
  const { candidateId, title } = req.body;
  const fileUrl = "test";

  if (!isObjectId(candidateId)) return throwError("Invalid candidate ID.");

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return throwError("Candidate doesn't exist.", 404);

  const assessment = new Assessment({
    title,
    candidateId,
    fileUrl,
  });

  const savedAssessment = await assessment.save();
  successResponse({
    res,
    message: `Assessment - '${savedAssessment.title}' created.`,
    data: savedAssessment,
  });
};

export const getAllAssessments = async (req: Request, res: Response) => {
  const assessments = await Assessment.find().populate("candidateId");
  successResponse({ res, data: assessments });
};

export const getAssessmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId) return throwError("Invalid assessment ID.");

  const assessment = await Assessment.findById(id).populate("candidateId");
  successResponse({ res, data: assessment });
};

export const getAssessmentsByCandidateId = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  if (!isObjectId) return throwError("Invalid candidate ID.");

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError("Candidate doesn't exist.", 404);

  const assessments = await Assessment.find({ candidateId: id }).populate(
    "candidateId"
  );
  successResponse({ res, data: assessments });
};

export const deleteAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid assessment ID");

  const deletedAssessment = await Assessment.findByIdAndDelete(id);
  if (!deletedAssessment) return throwError("Assessment doesn't exist.", 404);

  successResponse({
    res,
    message: `Assessment - '${deletedAssessment.title}' deleted.`,
  });
};

export const updatedAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, evaluation, candidateId } = req.body;
  if (!isObjectId(id)) return throwError("Invalid assessment ID");

  if (!isObjectId(candidateId)) return throwError("Invalid candidate ID");

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return throwError("Candidate doesn't exist.", 404);

  const updatedAssessment = await Assessment.findByIdAndUpdate(
    id,
    { title, evaluation, candidateId },
    { new: true }
  );

  if (!updatedAssessment) return throwError("Assessment doesn't exist.", 404);

  successResponse({
    res,
    message: `Assessment - '${updatedAssessment.title}' updated.`,
  });
};
