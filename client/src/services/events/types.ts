import { Event } from "@/lib/types";

export type GetEventsByCandidateIdResponse = {
  message: string;
  data: Event[];
};

export type GetRecentEventsResponse = {
  message: string;
  data: Event[];
};
