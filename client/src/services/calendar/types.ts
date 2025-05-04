import { CandidatePreview } from "../candidates/type";

export type CalendarEvent = {
  _id: string;
  title: string;
  interviewers: CandidatePreview[];
  candidate: CandidatePreview;
  start: string;
  end: string;
  status: "scheduled" | "rescheduled" | "cancelled" | "completed";
};

export type MultiEventResponse = {
  message: string;
  data: CalendarEvent[];
};

export type SingleEventResponse = {
  message: string;
  data: CalendarEvent;
};
