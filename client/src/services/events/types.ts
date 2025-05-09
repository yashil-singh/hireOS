import { Event } from "../calendar/types";

export type GetEventsByCandidateIdResponse = {
  message: string;
  data: Event[];
};

export type GetRecentEventsResponse = {
  message: string;
  data: Event[];
};
