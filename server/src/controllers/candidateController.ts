import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Candidate, { Experience } from "@/models/Candidate";
import { Request, Response } from "express";

export const createCandidate = async (req: Request, res: Response) => {
  const {
    name,
    phone,
    email,
    level,
    technology,
    reference,
    experience,
    salaryExpectation,
    status,
  } = req.body;

  const existingCandidate = await Candidate.findOne({ email });

  if (existingCandidate)
    return throwError(`A candidate with '${email}' already exists.`);

  const updatedExperience = experience.map((exp: Experience) => {
    const startDate = new Date(exp.startDate);
    const endDate = new Date(exp.endDate);

    const yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    const monthsDifference = endDate.getMonth() - startDate.getMonth();

    const totalMonths = yearsDifference * 12 + monthsDifference;

    return { ...exp, duration: totalMonths };
  });

  const candidate = new Candidate({
    name,
    phone,
    email,
    level,
    technology,
    reference,
    experience: updatedExperience,
    salaryExpectation,
    status,
    resumeUrl: "N/A",
  });

  const savedCandidate = await candidate.save();

  successResponse({
    res,
    message: "Candidate profie added.",
    data: savedCandidate,
  });
};

export const getAllCandidates = async (req: Request, res: Response) => {
  const candidates = await Candidate.find();
  successResponse({ res, data: candidates });
};

export const getCandidateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid candidate ID");

  const candidate = await Candidate.findById(id);

  if (!candidate) return throwError("Candidate doesn't exist.", 404);

  successResponse({ res, data: candidate });
};

export const deleteCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid candidate ID");

  const deletedCandidate = await Candidate.findByIdAndDelete(id);

  if (!deletedCandidate) return throwError("Candidate doesn't exist.", 404);

  successResponse({ res, message: "Candidate profile deleted." });
};

export const updateCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid candidate ID");

  const {
    name,
    phone,
    email,
    level,
    technology,
    reference,
    experience,
    salaryExpectation,
    status,
  } = req.body;

  const updatedCandidate = await Candidate.findByIdAndUpdate(
    id,
    {
      name,
      phone,
      email,
      level,
      technology,
      reference,
      experience,
      salaryExpectation,
      status,
    },
    { new: true }
  );

  if (!updatedCandidate) return throwError("Candidate doesn't exist.", 404);

  successResponse({ res, data: updatedCandidate });
};
