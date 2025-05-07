import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Candidate from "@/models/Candidate";
import Draft from "@/models/Draft";
import Letter from "@/models/Letter";
import { Request, Response } from "express";
import { getCandidateProgressStatus } from "./eventsController";

export const sendLetter = async (req: Request, res: Response) => {
  const { candidateId, draftId, content } = req.body;

  let letterType = "others";
  let draft = null;

  if (!isObjectId(draftId)) return throwError(`Invalid draft ID - ${draftId}.`);
  draft = await Draft.findById(draftId);

  if (draft) {
    letterType = draft.type;
  }

  if (!isObjectId(candidateId))
    return throwError(`Invalid candidate ID - ${candidateId}`);
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return throwError(`Candidate not found.`, 404);

  const { currentEvent } = await getCandidateProgressStatus(candidateId);

  const currentStepTitle = currentEvent.title.toLowerCase();

  console.log("🚀 ~ letterController.ts:33 ~ letterType:", letterType);
  switch (letterType) {
    case "offer":
      if (currentStepTitle.includes("offer")) {
        currentEvent.activities.push({
          title: "Offer Letter Sent",
          description: `Candidate was sent an offer ${
            draft && "using the " + draft.title + " draft"
          }.`,
        } as any);
        currentEvent.status = "completed";
      } else return throwError("Candidate not in the offer stage.");
      break;
    case "rejection":
      if (currentStepTitle.includes("reject")) {
        currentEvent.activities.push({
          title: "Rejection Letter Sent",
          description: `Candidate was sent a rejection ${
            draft && "using the " + draft.title + " draft"
          }.`,
        } as any);
        currentEvent.status = "completed";
      } else
        return throwError(
          "Candidate is not yet rejected to use a rejection type draft."
        );
      break;
  }

  currentEvent.save();

  const letter = await Letter.create({
    draft: draftId,
    content,
    candidate: candidateId,
  });

  // TODO: Send email to candidate

  successResponse({
    res,
    message: `Letter sent to ${candidate.email}.`,
    data: letter,
  });
};

export const getAllLetters = async (req: Request, res: Response) => {
  const letters = await Letter.find().populate("candidate draft");
  successResponse({ res, data: letters });
};

export const getLetterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid letter ID.");

  const letter = await Letter.findById(id).populate("candidate draft");
  if (!letter) return throwError("Letter not found.", 404);

  successResponse({ res, data: letter });
};
