import {
  errorResponse,
  isObjectId,
  successResponse,
  throwError,
} from "@/lib/utils";
import Candidate from "@/models/Candidate";
import Event from "@/models/Event";
import HiringProcess from "@/models/HiringProcess";
import { Request, Response } from "express";
import { getCandidateProgressStatus } from "./eventsController";

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
  } = req.body;

  const existingCandidate = await Candidate.findOne({ email });

  if (existingCandidate)
    return throwError(`A candidate with '${email}' already exists.`);

  const candidate = new Candidate({
    name,
    phone,
    email,
    level,
    technology,
    reference,
    experience,
    salaryExpectation,
    status: "short-listed",
    resumeUrl: "N/A",
  });

  const savedCandidate = await candidate.save();

  const shortListStep = await HiringProcess.findOne({ title: "short-listed" });

  const event = new Event({
    title: "Candidate Shortlisted",
    status: "completed",
    candidate: savedCandidate._id,
    step: shortListStep!._id,
  });

  await event.save();

  successResponse({
    res,
    message: "Candidate profie added.",
    data: savedCandidate,
  });
};

export const getAllCandidates = async (req: Request, res: Response) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  successResponse({ res, data: candidates });
};

export const getCandidateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid candidate ID");

  const candidate = await Candidate.findById(id);

  if (!candidate) return throwError("Candidate doesn't exist.", 404);

  successResponse({ res, data: candidate });
};

export const getEligibleCandidates = async (req: Request, res: Response) => {
  const { status } = req.query;

  const steps = await HiringProcess.find();

  const INTERVIEW_STATUS = steps
    .filter((step) => step.title.includes("interview"))
    .map((step) => step.title);

  let candidates = [];

  switch (status) {
    case "interviewing":
      candidates = await Candidate.find({
        status: {
          $in: INTERVIEW_STATUS,
        },
      });
      break;

    case "assessment":
    case "offer":
      candidates = await Candidate.find({ status });
      break;

    default:
      candidates = await Candidate.find({
        $nin: ["hired", "rejected", "black-listed"],
      });
      break;
  }

  successResponse({ res, data: candidates });
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

  successResponse({
    res,
    data: updatedCandidate,
    message: "Candidate profile updated.",
  });
};

export const changeCandidateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stepId } = req.body;

  if (!isObjectId(id)) return throwError("Invalid candidate ID.");
  if (!isObjectId(stepId)) return throwError("Invalid step ID.");

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError("Candidate not found.", 404);

  if (candidate.status === "hired") throwError("Candidate is already hired.");

  const step = await HiringProcess.findById(stepId);

  if (!step) return throwError("Step not found.", 404);

  const candidateEvents = await Event.find({ candidate: id }).populate("step");
  if (!candidateEvents) return throwError("Invalid candidate data.");

  const {
    currentStep,
    nextStep,
    currentEvent,
    isCurrentEventCompleted,
    nextRequiredStep,
  } = await getCandidateProgressStatus(id);

  if (!currentEvent || !currentStep) return throwError("Invalid event data.");

  if (!isCurrentEventCompleted)
    return throwError(`\`${currentStep!.title}\` is not completed yet.`);

  if (!nextStep) return throwError("No further steps required.");

  if (step.step < nextStep.step)
    return throwError(
      "You cannot move the candidate back to a previous step in the hiring process."
    );

  if (step.step > nextStep.step) {
    if (
      nextRequiredStep &&
      step._id.toString() !== nextRequiredStep._id.toString()
    ) {
      return throwError(
        `You must move the candidate step-by-step. Expected next required step: ${nextRequiredStep.title}.`
      );
    }
  }

  await Event.create({
    title: step.title,
    status: "pending",
    candidate: id,
    step: step._id,
    activities: [],
  });

  candidate.status = step.title;
  const updatedCandidate = await candidate.save();

  const title = step.title.toLowerCase();
  let type = "";

  if (title.includes("assessment")) {
    type = "assessment";
  } else if (title.includes("interview")) {
    type = "interview";
  } else if (title.includes("offer") || title.includes("letter")) {
    type = "letter";
  }

  successResponse({
    res,
    message: "Candidate status updated.",
    data: { type, candidate: updatedCandidate },
  });
};
