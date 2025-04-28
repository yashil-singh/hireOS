import { z } from "zod";

export const addAssessmentSchema = z.object(
  {
    title: z
      .string({ required_error: "Title is required." })
      .min(1, "Title is required."),
    candidateId: z
      .string({ required_error: "Candidate ID is required." })
      .min(1, "Candidate ID is required."),
  },
  { message: "Request can't be empty." }
);

export const updateAssessmentSchema = z.object(
  {
    title: z
      .string({ required_error: "Title is required." })
      .min(1, "Title is required."),
    evaluation: z
      .string({ required_error: "Evaluation is required." })
      .min(1, "Evaluation is required."),
    candidateId: z
      .string({ required_error: "Candidate ID is required." })
      .min(1, "Candidate ID is required."),
  },
  { message: "Request can't be empty." }
);
