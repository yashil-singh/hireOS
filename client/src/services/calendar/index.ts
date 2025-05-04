import { z } from "zod";
import { GET, PATCH, POST } from "../api";

import {
  rescheduleInterviewSchema,
  scheduleInterviewSchema,
} from "@/lib/schemas/interviewSchemas";
import { MultiEventResponse, SingleEventResponse } from "./types";

const BASE = "/calendar";

export const getAllCalendarEvents = async (): Promise<MultiEventResponse> => {
  const response = await GET(`${BASE}/events`);
  return response;
};

export const getCalendarEventById = async (
  id: string,
): Promise<SingleEventResponse> => {
  const response = await GET(`${BASE}/events/${id}`);
  return response;
};

export const getCalendarEventsByCandidateId = async (
  id: string,
): Promise<MultiEventResponse> => {
  const response = await GET(`${BASE}/events/candidate/${id}`);
  return response;
};

export const getCalendarEventByCandidateId = async (
  id: string,
): Promise<MultiEventResponse> => {
  const response = await GET(`${BASE}/events/candidate/${id}`);
  return response;
};

export const scheduleInterview = async (
  data: z.infer<typeof scheduleInterviewSchema>,
): Promise<SingleEventResponse> => {
  const response = await POST(`${BASE}/schedule`, data);
  return response;
};

export const rescheduleInterview = async (
  id: string,
  data: z.infer<typeof rescheduleInterviewSchema>,
): Promise<SingleEventResponse> => {
  const response = await PATCH(`${BASE}/events/${id}/reschedule`, data);
  return response;
};

export const sendInterviewReminder = async (
  id: string,
): Promise<SingleEventResponse> => {
  const response = await POST(`${BASE}/events/${id}/remind`);
  return response;
};

export const markInterviewAsCompleted = async (
  id: string,
): Promise<SingleEventResponse> => {
  const response = await PATCH(`${BASE}/events/${id}/complete`);
  return response;
};
