import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { z } from "zod";

export type InterviewerFormValues = z.infer<typeof interviwerSchema>;

export type Interviewer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
};

export type MutateInterviewerResponse = {
  message: string;
  data: Interviewer;
};

export type MultiInterviewerResponse = {
  message: string;
  data: Interviewer[];
};

export type SingleInterviewerResponse = {
  message: string;
  data: Interviewer;
};
