import { Event } from "@/lib/types";
import { Candidate, CandidatePreview } from "../candidates/type";

export type CalendarEvent = {
  _id: string;
  title: string;
  interviewers: CandidatePreview[];
  event: Event;
  candidate: Candidate;
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
