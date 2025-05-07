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
      candidates = await Candidate.find({ status });
      break;

    case "offer":
      candidates = await Candidate.find({ status });
      break;

    case "rejection":
      candidates = await Candidate.find({
        status: { $regex: "reject", $options: "i" },
      });
      break;

    default:
      candidates = await Candidate.find({
        status: {
          $nin: ["black-listed"],
        },
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

  if (candidate.status === "hired")
    return throwError("Candidate is already hired");
  if (candidate.status === "rejected")
    return throwError("Candidate is already rejected.");
  if (candidate.status === "blacklisted")
    return throwError("Candidate is blacklisted.");

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

  if (step.step < currentStep.step)
    return throwError(
      "You cannot move the candidate back to a previous step in the hiring process."
    );

  if (!nextStep) return throwError("No further steps required.");

  if (step.step > nextStep.step) {
    if (
      !step.title.includes("offer") &&
      nextRequiredStep &&
      step._id.toString() !== nextRequiredStep._id.toString()
    ) {
      return throwError(
        `You must move the candidate step-by-step. Expected next required step: ${nextRequiredStep.title}.`
      );
    }
  }

  if (!isCurrentEventCompleted)
    return throwError(`\`${currentStep!.title}\` is not completed yet.`);

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

export const hireCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError(`Invalid candidate ID - ${id}`);

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError(`Candidate - ${id} not found.`);

  if (candidate.status === "hired")
    return throwError("Candidate is already hired");
  if (candidate.status === "rejected")
    return throwError("Candidate is already rejected.");
  if (candidate.status === "blacklisted")
    return throwError("Candidate is blacklisted.");

  const { currentStep, currentEvent, isCurrentEventCompleted } =
    await getCandidateProgressStatus(id);

  const activites = currentEvent.activities;

  if (activites.length > 0) {
    if (!isCurrentEventCompleted)
      return throwError(
        `Candidate has pending tasks left in the ${currentStep.title} stage.`
      );
  }

  await Event.create({
    title: "Hired",
    status: "completed",
    candidate: candidate._id,
    activities: [
      {
        title: "Status Update",
        description: "Candidate moved to hired status.",
      },
    ],
  });

  candidate.status = "hired";
  const updatedCandidate = await candidate.save();

  successResponse({
    res,
    message: `Candidate ${candidate.name} - ${candidate.email} hired.`,
    data: updatedCandidate,
  });
};

export const rejectCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError(`Invalid candidate ID - ${id}`);

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError(`Candidate - ${id} not found.`, 404);

  if (candidate.status === "hired")
    return throwError("Candidate is already hired");
  if (candidate.status === "rejected")
    return throwError("Candidate is already rejected.");
  if (candidate.status === "blacklisted")
    return throwError("Candidate is blacklisted.");

  const { isCurrentEventCompleted, currentEvent, currentStep } =
    await getCandidateProgressStatus(id);

  if (!isCurrentEventCompleted) {
    if (currentEvent.activities.length > 0)
      return throwError(
        `Candidate has pending tasks left in the ${currentStep.title} stage.`
      );

    currentEvent.status = "cancelled";
  }

  candidate.status = "rejected";
  await currentEvent.save();

  await Event.create({
    title: "Rejected",
    candidate: candidate._id,
    activities: [
      {
        title: "Status Update",
        description: "Candidate moved to rejected status.",
      },
    ],
  });

  const updatedCandidate = await candidate.save();

  successResponse({
    res,
    message: `Candidate ${candidate.name} - ${candidate.email} rejected.`,
    data: updatedCandidate,
  });
};

export const blacklistCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError(`Invalid candidate ID - ${id}`);

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError(`Candidate - ${id} not found.`);

  if (candidate.status === "hired")
    return throwError("Candidate is already hired");
  if (candidate.status === "rejected")
    return throwError("Candidate is already rejected.");
  if (candidate.status === "blacklisted")
    return throwError("Candidate is blacklisted.");

  const { isCurrentEventCompleted, currentEvent } =
    await getCandidateProgressStatus(id);

  candidate.status = "black-listed";

  await Event.create({
    title: "Black-Listed",
    status: "completed",
    candidate: candidate._id,
  });

  if (!isCurrentEventCompleted) {
    currentEvent.status = "cancelled";
    await currentEvent.save();
  }

  const updatedCandidate = await candidate.save();

  successResponse({
    res,
    message: `Candidate ${candidate.name} - ${candidate.email} rejected.`,
    data: updatedCandidate,
  });
};
