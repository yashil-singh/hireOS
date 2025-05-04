import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { z } from "zod";
import { GET, POST } from "../api";
import { GetInterviewersResponse, MutateInterviewerResponse } from "./types";

export const createInterviewer = async (
  data: z.infer<typeof interviwerSchema>,
): Promise<MutateInterviewerResponse> => {
  const response = await POST("/interviewers", data);
  return response;
};

export const getAllInterviewers =
  async (): Promise<GetInterviewersResponse> => {
    const response = await GET("/interviewers");
    return response;
  };
