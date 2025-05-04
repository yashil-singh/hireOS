import { GET } from "../api";
import {
  GetEventsByCandidateIdResponse,
  GetRecentEventsResponse,
} from "./types";

export const getEventsByCandidateId = async (
  id: string,
): Promise<GetEventsByCandidateIdResponse> => {
  const response = await GET(`/events/candidate/${id}`);
  return response;
};

export const getRecentEvents = async (
  limit?: string,
): Promise<GetRecentEventsResponse> => {
  const params = new URLSearchParams();
  if (limit) {
    params.set("limit", limit);
  }
  const response = await GET("/events/recent", params);
  return response;
};
