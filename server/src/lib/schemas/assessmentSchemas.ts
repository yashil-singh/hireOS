import { z } from "zod";

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
      fileUrl: z.string().optional(),
    },
    { message: "Request can't be empty." }
  )
  .superRefine((data, ctx) => {
    // if (data.format === "file" && !data.fileUrl) {
    //   ctx.addIssue({
    //     path: ["assessmentFile"],
    //     code: z.ZodIssueCode.custom,
    //     message: "Assessment file url is required.",
    //   });
    // }

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
