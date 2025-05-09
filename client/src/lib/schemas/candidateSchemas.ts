import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

export const candidateSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required.")
    .max(20, "Name must be less than 20 characters."),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(10, "Invalid phone number.")
    .refine((value) => isValidPhoneNumber(value, "NP"), {
      message: "Invalid phone number.",
    }),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email({ message: "Invalid email address." }),
  reference: z.string().email({ message: "Invalid email address." }).optional(),
  technology: z
    .array(z.string())
    .min(1, "Please select atlease one technology."),
  level: z.string().min(1, "Position is required."),
  salaryExpectation: z
    .string({ required_error: "Salary is required." })
    .min(1, { message: "Salary is required." })
    .refine(
      (val) => {
        const value = Number(val);

        if (isNaN(value)) {
          return false;
        }

        if (value < 0) {
          return false;
        }

        return true;
      },
      {
        message: "Salary cannot be negative. Please enter a valid amount.",
      },
    )
    .refine(
      (val) => {
        if (Number(val) > 99999999) return false;

        return true;
      },
      {
        message:
          "Salary exceeds the allowed limit. Please enter a valid amount.",
      },
    ),
  experience: z
    .array(
      z
        .object({
          jobTitle: z.string().min(1, "Job title is required."),
          company: z.string().min(1, "Company name is required."),
          startDate: z.string().min(1, "Start date is required."),
          endDate: z.string().min(1, "End date is required."),
        })
        .refine((data) => new Date(data.startDate) < new Date(), {
          message: "Invalid start date.",
          path: ["startDate"],
        })
        .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
          message: "End date must be after start date.",
          path: ["endDate"],
        }),
    )
    .optional(),
  resumeFile: z
    .instanceof(File, { message: "Resume is required." })
    .refine((file) => file.size > 0, {
      message: "Resume file cannot be empty.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB.",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message:
        "Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, or PNG allowed.",
    }),
});

export const experienceSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required."),
    company: z.string().min(1, "Company name is required."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
  })
  .refine((data) => new Date(data.startDate) < new Date(), {
    message: "Invalid start date.",
    path: ["startDate"],
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date.",
    path: ["endDate"],
  });
