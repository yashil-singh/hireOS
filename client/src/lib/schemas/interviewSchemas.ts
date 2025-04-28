import { z } from "zod";

export const scheduleInterviewSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required." })
      .min(1, "Title is required.")
      .max(50, "Title must be less than 50 characters."),
    date: z
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
    startTime: z.date({
      required_error: "Start time is required.",
    }),

    endTime: z.date({
      required_error: "End time is required.",
    }),

    candidate: z
      .string({
        required_error: "Candidate is required.",
      })
      .min(1, { message: "Candidate is required." }),

    interviewers: z
      .array(z.string())
      .min(1, { message: "At least one interviewer is required." })
      .max(3, { message: "No more than 3 interviewers are allowed." }),
  })
  .refine(
    (data) => {
      return data.endTime >= data.startTime;
    },
    {
      message: "End time must be after start time.",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => data.endTime.getTime() > data.startTime.getTime() + 5 * 60 * 1000,
    {
      message: "Interview time is too short.",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      const today = new Date();
      const interviewDate = new Date(data.date);
      const isToday =
        interviewDate.getFullYear() === today.getFullYear() &&
        interviewDate.getMonth() === today.getMonth() &&
        interviewDate.getDate() === today.getDate();

      if (!isToday) return true;

      return data.startTime > today;
    },
    {
      message: "Start time cannot be in the past.",
      path: ["startTime"],
    },
  );
