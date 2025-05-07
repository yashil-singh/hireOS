import { z } from "zod";

export const letterFormSchema = z.object({
  candidateId: z.string().min(1, "Candidate is required."),
  draftId: z.string().optional(),
  content: z
    .string()
    .min(1, "Content can't be empty.")
    .max(5000, "Content must be less than 5000 characters.")
    .refine(
      (value) => value.replace(/<p>\s*<\/p>/g, "").trim().length > 0,
      "Content cannot be empty",
    ),
});

export const draftFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(50, "Title must be less than 50 characters."),
  type: z.enum(["offer", "rejection", "others"]),
  content: z
    .string()
    .min(1, "Content is required.")
    .max(5000, "Content must be less than 5000 characters.")
    .refine(
      (value) => value.replace(/<p>\s*<\/p>/g, "").trim().length > 0,
      "Content cannot be empty",
    ),
  variables: z
    .array(
      z.object({
        _id: z.string().nullable(),
        key: z.string(),
      }),
    )
    .optional(),
});

export const draftVariableFormSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required.")
    .max(20, "Key must be less than 20 characters.")
    .regex(/^{{\w+}}$/, {
      message: "Key must be in the format {{variableName}}.",
    }),
  label: z
    .string()
    .min(1, "Label is required.")
    .max(50, "Label must be less than 50 characters."),
  description: z
    .string()
    .max(100, "Description must be less than 100 characters.")
    .optional(),
});
