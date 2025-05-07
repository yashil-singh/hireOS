import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Draft from "@/models/Draft";
import DraftVariable from "@/models/DraftVariables";
import { Request, Response } from "express";

export const createDraft = async (req: Request, res: Response) => {
  const { title, content, tags, variables, type } = req.body;

  for (const variable of variables) {
    if (!isObjectId(variable._id))
      return throwError(
        `Variable ${variable.key} is not available. Either add it or exclude it from the letter.`
      );

    const existingVariable = await DraftVariable.findById(variable._id);
    if (!existingVariable)
      return throwError(
        `Variable ${variable.key} is not available. Either add it or exclude it from the letter.`
      );
  }

  const draft = await Draft.create({
    title,
    content,
    tags,
    variables,
    type,
  });

  successResponse({ res, message: "Draft created.", data: draft });
};

export const editDraft = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, tags, variables } = req.body;

  if (!isObjectId(id)) return throwError("Invalid draft ID.");

  const draft = await Draft.findByIdAndUpdate(
    id,
    {
      title,
      content,
      tags,
      variables,
    },
    {
      new: true,
    }
  );

  if (!draft) return throwError("Failed to update draft.");

  successResponse({ res, message: "Draft updated.", data: draft });
};

export const deleteDraft = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid draft ID.");

  const deletedDraft = await Draft.findByIdAndDelete(id);

  if (!deletedDraft) return throwError("Draft not found or already deleted.");

  successResponse({ res, message: "Draft deleted." });
};

export const getAllDrafts = async (req: Request, res: Response) => {
  const drafts = await Draft.find()
    .populate("variables")
    .sort({ createdAt: -1 });
  successResponse({ res, data: drafts });
};

export const getDraftById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid draft ID.");

  const draft = await Draft.findById(id).populate("variables");
  if (!draft) return throwError("Draft not found.", 404);

  successResponse({ res, data: draft });
};

export const getAllDraftVariables = async (req: Request, res: Response) => {
  const variables = await DraftVariable.find();
  successResponse({ res, data: variables });
};

export const getDraftVariableById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid variable ID.");

  const variable = await DraftVariable.findById(id);
  if (!variable) return throwError("Variable not found.", 404);

  successResponse({ res, data: variable });
};

export const createDraftVariable = async (req: Request, res: Response) => {
  const { key, description, label } = req.body;

  const existingVariable = await DraftVariable.findOne({ key });
  if (existingVariable) return throwError("Variable already exists.", 409);

  const variable = await DraftVariable.create({
    key,
    description,
    label,
  });

  successResponse({ res, message: "Variable added.", data: variable });
};

export const seedDraftVariables = async () => {
  const count = await DraftVariable.countDocuments();
  if (count === 0) {
    await DraftVariable.insertMany([
      {
        label: "Candidate Name",
        key: "{{candidateName}}",
        isSystem: true,
        description: "Replaced with the name of the candidate.",
      },
      {
        label: "Candidate Email",
        key: "{{candidateEmail}}",
        isSystem: true,
        description: "Replaced with the email of the candidate.",
      },
      {
        label: "Candidate Phone",
        key: "{{candidatePhone}}",
        isSystem: true,
        description: "Replaced with the phone number of the candidate.",
      },
      {
        label: "Job Title",
        key: "{{jobTitle}}",
        isSystem: true,
        description: "Replaced with the position level of the candidate.",
      },
      {
        label: "Salary",
        key: "{{salary}}",
        isSystem: true,
        description: "Replaced with the expected salary of the candidate.",
      },
      {
        label: "Acceptance Deadline",
        key: "{{acceptanceDeadline}}",
        isSystem: true,
        description:
          "Replaced with the date that the candidate has till accepting the offer.",
      },
      {
        label: "Start Date",
        key: "{{startDate}}",
        isSystem: true,
        description: "Replaced with a start date.",
      },
    ]);
    console.log("✅ Default draft variables seeded.");
  } else {
    console.log("ℹ️ Draft variables already exist. Skipping seed.");
  }
};

export const seedDrafts = async () => {
  const count = await Draft.countDocuments();

  const candidateName = await DraftVariable.findOne({
    key: "{{candidateName}}",
    isSystem: true,
  });
  const candidateEmail = await DraftVariable.findOne({
    key: "{{candidateEmail}}",
    isSystem: true,
  });
  const candidatePhone = await DraftVariable.findOne({
    key: "{{candidatePhone}}",
    isSystem: true,
  });
  const jobTitle = await DraftVariable.findOne({
    key: "{{jobTitle}}",
    isSystem: true,
  });
  const salary = await DraftVariable.findOne({
    key: "{{salary}}",
    isSystem: true,
  });
  const acceptanceDeadline = await DraftVariable.findOne({
    key: "{{acceptanceDeadline}}",
    isSystem: true,
  });
  const startDate = await DraftVariable.findOne({
    key: "{{startDate}}",
    isSystem: true,
  });

  if (
    !candidateName ||
    !candidateEmail ||
    !candidatePhone ||
    !salary ||
    !jobTitle ||
    !acceptanceDeadline ||
    !startDate
  )
    return throwError(
      "Draft variables not seeded properly. Please restart the server."
    );

  if (count === 0) {
    await Draft.insertMany([
      {
        title: "Offer Letter",
        type: "offer",
        content: `<p><strong>Subject:</strong> Employment Offer for the Position of {{jobTitle}}</p><p></p><p>Dear {{candidateName}},</p><p></p><p>We are pleased to extend to you an offer of employment for the position of <strong>{{jobTitle}}</strong> at <strong>HireOS</strong>. We were impressed with your background and experience, and we are confident that you will be a valuable addition to our team.</p><p></p><p>Your employment with us is expected to commence on <strong>{{startDate}}</strong>, or such other mutually agreed-upon date. In this role. You will receive a starting salary of <strong>{{salary}}</strong>, paid on a monthly basis, and subject to all applicable taxes and deductions. In addition, you will be eligible for our standard benefits package.</p><p></p><p>This offer is contingent upon the successful completion of our background verification process and submission of required documentation. Upon acceptance, please sign and return this letter by <strong>{{acceptanceDeadline}}</strong> to confirm your agreement.</p><p></p><p>We are excited about the possibility of you joining us and look forward to your positive response.</p><p></p><p>Sincerely,<br><strong>HireOS</strong> <strong>HR</strong><br><strong>HR</strong><br><strong>HireOS</strong></p>`,
        isSystem: true,
        isDefault: true,
        variables: [
          candidateName,
          jobTitle,
          acceptanceDeadline,
          salary,
          startDate,
        ],
      },
      {
        title: "Rejection Letter",
        type: "rejection",
        content: `<p><strong>Subject:</strong> Update on application for the Position of {{jobTitle}}</p><p></p><p>Dear {{candidateName}},</p><p></p><p>Thank you for taking the time to apply for the {{jobTitle}} position at HireOS and for the effort you put into the interview process. </p><p></p><p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. This decision was not easy, as we had many strong candidates, including yourself.</p><p></p><p> We sincerely appreciate your interest in joining our team and the opportunity to learn more about your skills and experience. We will keep your profile on file for future opportunities that align with your background. </p><p></p><p>Thank you once again for considering a career with HireOS. We wish you the very best in your job search and future professional endeavors.</p><p></p><p>Sincerely,<br><strong>HireOS</strong> <strong>HR</strong><br><strong>HR</strong><br><strong>HireOS</strong></p>`,
        isSystem: true,
        isDefault: true,
        variables: [jobTitle, candidateName],
      },
    ]);
    console.log("✅ Default drafts seeded.");
  } else {
    console.log("ℹ️ Drafts already exist. Skipping seed.");
  }
};
