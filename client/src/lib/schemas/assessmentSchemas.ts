import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

// export const assessmentSchema = z
//   .object({
//     title: z
//       .string({ required_error: "Title is required." })
//       .min(1, "Title is required.")
//       .max(50, "Title must be less than 50 characters."),
//     description: z.string().optional(),
//     deadlineDate: z
//       .date({
//         required_error: "Interview date is required.",
//       })
//       .refine((date) => {
//         const now = new Date();
//         const today = new Date(
//           now.getFullYear(),
//           now.getMonth(),
//           now.getDate(),
//         );

//         return date >= today;
//       }, "Interview date cannot be in the past."),
//     deadlineTime: z.date({
//       required_error: "Start time is required.",
//     }),
//     assessmentType: z
//       .string({ required_error: "Assessment type is required." })
//       .min(1, "Assessment type is required."),
//     format: z.enum(["file", "link"], {
//       required_error: "Assessment format is required.",
//     }),
//     technologies: z
//       .array(z.string())
//       .min(1, "Please select atlease one technology."),
//     link: z.string().optional(),
// assessmentFile: z
//   .any()
//   .optional()
//   .refine((file) => !file || file instanceof File, {
//     message: "Invalid file.",
//   })
//   .refine((file) => !file || file.size > 0, {
//     message: "File cannot be empty.",
//   })
//   .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//     message: "File must be less than 10MB.",
//   })
//   .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
//     message:
//       "Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, or PNG allowed.",
//   }),
//   })
//   .refine(
//     (data) => {
//       const today = new Date();
//       const deadlineDate = new Date(data.deadlineDate);
//       const isToday =
//         deadlineDate.getFullYear() === today.getFullYear() &&
//         deadlineDate.getMonth() === today.getMonth() &&
//         deadlineDate.getDate() === today.getDate();

//       if (!isToday) return true;

//       return data.deadlineTime > today;
//     },
//     {
//       message: "Start time cannot be in the past.",
//       path: ["startTime"],
//     },
//   )
//   .superRefine((data, ctx) => {
//     if (data.format === "file" && !data.assessmentFile) {
//       ctx.addIssue({
//         path: ["assessmentFile"],
//         code: z.ZodIssueCode.custom,
//         message: "Assessment file is required.",
//       });
//     }

//     if (data.format === "link") {
//       // If link is empty, add error
//       if (!data.link || data.link.trim() === "") {
//         ctx.addIssue({
//           path: ["link"],
//           code: z.ZodIssueCode.custom,
//           message: "Assessment link is required.",
//         });
//       } else {
//         // Regex pattern for validating URL (basic validation)
//         const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

//         // Test if the link matches the URL regex
//         if (!urlPattern.test(data.link)) {
//           ctx.addIssue({
//             path: ["link"],
//             code: z.ZodIssueCode.custom,
//             message: "Please enter a valid URL.",
//           });
//         }
//       }
//     }
//   });

export const assessmentSchema = z
  .object(
    {
      title: z
        .string({ required_error: "Title is required." })
        .min(1, "Title is required."),
      description: z.string().optional(),
      technologies: z
        .array(z.string())
        .min(1, "Please select atlease one technology."),
      assessmentType: z
        .string({ required_error: "Assessment type is required." })
        .min(1, "Assessment type is required."),
      format: z.enum(["file", "link"], {
        required_error: "Assessment format is required.",
      }),
      link: z.string().optional(),
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
    },
    { message: "Request can't be empty." },
  )
  .superRefine((data, ctx) => {
    if (data.format === "file" && !data.assessmentFile) {
      ctx.addIssue({
        path: ["assessmentFile"],
        code: z.ZodIssueCode.custom,
        message: "Assessment file is required.",
      });
    }

    if (data.format === "link") {
      if (!data.link || data.link.trim() === "") {
        ctx.addIssue({
          path: ["link"],
          code: z.ZodIssueCode.custom,
          message: "Assessment link is required.",
        });
      } else {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

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

export const assignAssessmentSchema = z
  .object({
    candidates: z.array(z.string()).min(1, "Select at least one candidate."),
    deadlineDate: z
      .date({
        required_error: "Interview date is required.",
      })
      .refine((date) => {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return date >= today;
      }, "Interview date cannot be in the past."),
    deadlineTime: z.date({
      required_error: "Start time is required.",
    }),
  })
  .refine(
    (data) => {
      const today = new Date();
      const deadlineDate = new Date(data.deadlineDate);
      const isToday =
        deadlineDate.getFullYear() === today.getFullYear() &&
        deadlineDate.getMonth() === today.getMonth() &&
        deadlineDate.getDate() === today.getDate();

      if (!isToday) return true;

      return data.deadlineTime > today;
    },
    {
      message: "Time cannot be in the past.",
      path: ["deadlineTime"],
    },
  );

export const evaluateAssessmentSchema = z.object({
  interviewerId: z
    .string({ required_error: "Evaluator is required." })
    .min(1, "Evaluator is required."),
  rating: z
    .number({ required_error: "Rating is required." })
    .max(5, "Maximum rating is 5."),
  submissionFormat: z.enum(["file", "link"], {
    required_error: "Assessment format is required.",
  }),
  remarks: z
    .string({ required_error: "Remarks is required." })
    .max(200, "Remarks must be less than 200 characters."),
  submissionLink: z.string().optional(),
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
});
