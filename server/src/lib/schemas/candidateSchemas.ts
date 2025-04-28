import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const addCandidateSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required.")
    .max(20, "Name must be less than 20 characters."),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(1, "Phone number is required.")
    .refine((value) => isValidPhoneNumber(value, "NP"), {
      message: "Invalid phone number.",
    }),
  email: z
    .string({ required_error: "Email address is required." })
    .min(1, "Email address is required.")
    .email({ message: "Invalid email address." }),
  reference: z
    .string({ message: "Invalid format for reference." })
    .email({ message: "Invalid reference email address." })
    .optional(),
  technology: z.array(z.string(), {
    message: "At least one technology is required.",
  }),
  level: z
    .string({ required_error: "Position is required." })
    .min(1, "Position is required."),
  salaryExpectation: z
    .string({ required_error: "Salary is required." })
    .min(1, { message: "Salary is required." })
    .refine(
      (val) => {
        const value = Number(val);

        if (isNaN(value)) {
          return false;
        }

        return true;
      },
      {
        message: "Invalid salary.",
      }
    ),
  experience: z
    .array(
      z.object({
        jobTitle: z.string().min(1, "Job title is required."),
        company: z.string().min(1, "Company name is required."),
        startDate: z.string().min(1, "Start date is required."),
        endDate: z.string().min(1, "End date is required."),
      })
    )
    .optional(),
  status: z
    .string({ required_error: "Status is required." })
    .min(1, "Status is required."),
});
