import { Timestamps } from "@/lib/types";
import { Candidate, CandidatePreview } from "../candidates/type";
import { HiringProcessStep } from "../hiringProcess/types";

export type Event = {
  _id: string;
  title: string;
  candidate: Candidate;
  description: string;
  step?: HiringProcessStep;
  status: "completed" | "pending" | "rejected" | "cancelled";
  activities: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
  createdAt: string;
};

export type InterviewerFeedback = {
  interviewer: CandidatePreview;
  feedback: string;
};

export interface CalendarEvent extends Timestamps {
  _id: string;
  title: string;
  event: Event;
  interviewers: CandidatePreview[];
  candidate: Candidate;
  status: "scheduled" | "rescheduled" | "cancelled" | "completed";
  feedbacks: InterviewerFeedback[];
  start: string;
  end: string;
}

export type MultiEventResponse = {
  message: string;
  data: CalendarEvent[];
};

export type SingleEventResponse = {
  message: string;
  data: CalendarEvent;
};
