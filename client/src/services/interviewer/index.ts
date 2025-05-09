import { GET, PATCH, POST } from "../api";
import {
  InterviewerFormValues,
  MultiInterviewerResponse,
  MutateInterviewerResponse,
  SingleInterviewerResponse,
} from "./types";

export const createInterviewer = async (
  data: InterviewerFormValues,
): Promise<MutateInterviewerResponse> => {
  const response = await POST("/interviewers", data);
  return response;
};

export const getAllInterviewers = async (
  params?: URLSearchParams,
): Promise<MultiInterviewerResponse> => {
  const response = await GET("/interviewers", params);
  return response;
};

export const editInterviewer = async (
  id: string,
  values: InterviewerFormValues,
): Promise<SingleInterviewerResponse> => {
  const response = await PATCH(`/interviewers/${id}`, values);
  return response;
};
