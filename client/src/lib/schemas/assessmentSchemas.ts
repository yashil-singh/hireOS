import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

export const assessmentSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required." })
      .min(1, "Title is required.")
      .max(50, "Title must be less than 50 characters."),
    description: z.string().optional(),
    type: z
      .string({ required_error: "Assessment type is required." })
      .min(1, "Assessment type is required."),
    format: z.enum(["file", "link"], {
      required_error: "Assessment format is required.",
    }),
    link: z.string().optional(),
    technology: z
      .array(z.string())
      .min(1, "Please select atlease one technology."),
    assessmentFile: z
      .any()
      .optional()
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file.",
      })
      .refine((file) => !file || file.size > 0, {
        message: "File cannot be empty.",
      })
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "File must be less than 10MB.",
      })
      .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
        message:
          "Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, or PNG allowed.",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.format === "file" && !data.assessmentFile) {
      ctx.addIssue({
        path: ["assessmentFile"],
        code: z.ZodIssueCode.custom,
        message: "Assessment file is required.",
      });
    }

    if (data.format === "link") {
      // If link is empty, add error
      if (!data.link || data.link.trim() === "") {
        ctx.addIssue({
          path: ["link"],
          code: z.ZodIssueCode.custom,
          message: "Assessment link is required.",
        });
      } else {
        // Regex pattern for validating URL (basic validation)
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

        // Test if the link matches the URL regex
        if (!urlPattern.test(data.link)) {
          ctx.addIssue({
            path: ["link"],
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid URL.",
          });
        }
      }
    }
  });

export const assignAssessmentSchema = z.object({
  assessmentId: z
    .string({ required_error: "Assessment ID is required." })
    .min(1, "Assessment ID is required."),
  candidates: z.array(z.string()).min(1, "Select at least one candidate."),
});

export const evaluateAssessmentSchema = z
  .object({
    rating: z.number({ required_error: "Rating is required." }),
    format: z.enum(["file", "link"], {
      required_error: "Assessment format is required.",
    }),
    remarks: z
      .string({ required_error: "Remarks is required." })
      .min(1, "Remarks is required.")
      .max(200, "Remarks must be less than 200 characters."),
    link: z.string().optional(),
    submittedFile: z
      .any()
      .optional()
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file.",
      })
      .refine((file) => !file || file.size > 0, {
        message: "File cannot be empty.",
      })
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "File must be less than 10MB.",
      })
      .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
        message:
          "Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, or PNG allowed.",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.format === "file" && !data.submittedFile) {
      ctx.addIssue({
        path: ["submittedFile"],
        code: z.ZodIssueCode.custom,
        message: "Submitted file is required.",
      });
    }
  });
