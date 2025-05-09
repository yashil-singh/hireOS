import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from "@/lib/constants";
import {
  errorResponse,
  isObjectId,
  successResponse,
  throwError,
} from "@/lib/utils";
import Assessment from "@/models/Assessment";
import Candidate from "@/models/Candidate";
import Event, { IActivity } from "@/models/Event";
import HiringProcess from "@/models/HiringProcess";
import Interviewer from "@/models/Interviewer";
import { format } from "date-fns";
import { Request, Response } from "express";

export const createAssessment = async (req: Request, res: Response) => {
  const {
    title,
    description,
    technologies,
    format,
    assessmentType,
    link,
    deadlineDate,
    deadlineTime,
  } = req.body;

  const fileUrl = "https://assessmentfile.com";

  const assessment = await Assessment.create({
    title,
    description,
    technologies,
    format,
    assessmentType,
    link,
    deadlineDate,
    deadlineTime,
    fileUrl,
  });

  successResponse({
    res,
    message: `Assessment - '${assessment.title}' created.`,
    data: assessment,
  });
};

export const getAllAssessments = async (req: Request, res: Response) => {
  const { search } = req.query;

  const query: any = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { technologies: { $regex: search, $options: "i" } },
      { format: { $regex: search, $options: "i" } },
    ];
  }

  const assessments = await Assessment.find(query)
    .populate({
      path: "assignments",
      populate: [
        { path: "candidate", model: "Candidate" },
        { path: "interviewer", model: "Interviewer" },
      ],
    })
    .sort({ createdAt: -1 });
  successResponse({ res, data: assessments });
};

export const getAssessmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId) return throwError("Invalid assessment ID.");

  const assessment = await Assessment.findById(id).populate({
    path: "assignments",
    populate: [
      { path: "candidate", model: "Candidate" },
      { path: "interviewer", model: "Interviewer" },
    ],
  });
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

  const assessments = await Assessment.find({
    "assignments.candidate": id,
  })
    .populate("assignments.candidate")
    .populate("assignments.interviewer")
    .sort({ createdAt: -1 });
  successResponse({ res, data: assessments });
};

export const assignAssessment = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid assessment ID.");

  const { candidates, deadlineDate, deadlineTime } = req.body;

  const assessment = await Assessment.findById(id);
  if (!assessment) return throwError("Assessment not found.", 404);

  let pendingCandidates = [];
  let assignments = [];

  for (const candidateId of candidates) {
    if (!isObjectId(candidateId))
      return throwError("Candidate not found.", 404);

    const existing = await Candidate.findById(candidateId);
    if (!existing) return throwError("Candidate not found.");

    const pendingAssessment = await Assessment.findOne({
      "assignments.candidate": candidateId,
      "assignments.status": "pending",
    }).populate("assignments.candidate");

    if (pendingAssessment) {
      pendingCandidates.push(existing);
      continue;
    }

    assignments.push({
      candidate: candidateId,
      deadlineDate,
      deadlineTime,
    });
  }

  if (pendingCandidates.length > 0) {
    res.status(409).json({
      success: false,
      message: "Some candidates have pending assessments.",
      candidates: pendingCandidates,
    });
    return;
  }

  assessment.assignments.push(...(assignments as any));

  const assessmentStep = await HiringProcess.findOne({
    title: {
      $regex: "assessment",
      $options: "i",
    },
  });

  if (!assessmentStep) return throwError("There is no assessment step.");

  const updatedAssessment = await assessment.save();
  await Promise.all(
    assignments.map(async (assignment) => {
      const candidateEvent = await Event.findOne({
        candidate: assignment.candidate,
        step: assessmentStep._id,
      });

      if (!candidateEvent) return;

      candidateEvent.status = "pending";
      candidateEvent.activities.push({
        title: `Assigned ${assessment.title} to candidate`,
        description: `Deadline: ${format(
          new Date(assignment.deadlineDate),
          DEFAULT_DATE_FORMAT
        )}, ${format(new Date(assignment.deadlineDate), DEFAULT_TIME_FORMAT)}`,
      } as any);

      await candidateEvent.save();
    })
  );

  successResponse({
    res,
    message: "Assessment assigned.",
    data: updatedAssessment,
  });
};

export const evaluateAssessment = async (req: Request, res: Response) => {
  const { assessmentId, candidateId } = req.params;
  const { rating, remarks, interviewerId, submissionFormat, submissionLink } =
    req.body;

  const submissionFileUrl = "https://submittedfile.com";

  if (!isObjectId(assessmentId)) return throwError("Invalid assessment ID");
  if (!isObjectId(candidateId)) return throwError("Invalid candidate ID");
  if (!isObjectId(interviewerId)) return throwError("Invalid interviewer ID");

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) return throwError("Assessment not found.");

  const interviewer = await Interviewer.findById(interviewerId);
  if (!interviewer) return throwError("Interviewer not found.");

  const isCandidateAssigned = assessment.assignments.some(
    (assignment) => assignment.candidate._id.toString() === candidateId
  );
  if (!isCandidateAssigned)
    return throwError("Candidate is not assigned this assessment.");

  assessment.assignments = assessment.assignments.map((assignment) => {
    if (assignment.candidate._id.toString() === candidateId) {
      return {
        ...assignment,
        status: "evaluated",
        rating,
        remarks,
        interviewer,
        submissionFormat,
        submissionLink:
          submissionFormat === "link" ? submissionLink : submissionFileUrl,
      };
    }

    return assignment as any;
  });

  const assessmentStep = await HiringProcess.findOne({
    title: {
      $regex: "assessment",
      $options: "i",
    },
  });

  if (!assessmentStep) return throwError("There is no assessment step.");

  await assessment.save();

  // TODO:add event activity
  const candidateEvent = await Event.findOne({
    candidate: candidateId,
    step: assessmentStep._id,
  });

  if (!candidateEvent) return;

  candidateEvent.status = "completed";
  candidateEvent.activities.push({
    title: `Evaluated ${assessment.title}`,
    description: `Candidate's submission evaluated with a rating of ${rating} stars.`,
  } as any);

  await candidateEvent.save();

  successResponse({ res, message: "Candidated evalutated." });
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

export const updateAssessment = async (req: Request, res: Response) => {
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
