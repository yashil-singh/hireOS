import { z } from "zod";
import { REGEX_PASSWORD } from "../constants";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(1, "Full name is required.")
    .max(20, "Name must be less than 20 characters"),
  email: z
    .string({ required_error: "Email address is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .regex(
      REGEX_PASSWORD,
      "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .regex(
      REGEX_PASSWORD,
      "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});
