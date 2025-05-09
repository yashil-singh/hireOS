import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const interviwerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, "Name is required."),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email is required.")
    .email("Invalid email address"),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(10, "Invalid phone number.")
    .refine((value) => isValidPhoneNumber(value, "NP"), {
      message: "Invalid phone number.",
    }),
});
