import z from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email({ message: "Invalid email address." }),
  password: z.string().min(1, "Password is required."),
});

export const signupFormSceham = z.object({
  name: z
    .string()
    .min(1, "Full name is required.")
    .max(20, "Name must be less than 20 characters long."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email({ message: "Invalid email address." }),
  password: z.string().min(1, "Password is required."),
});
