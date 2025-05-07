import { z } from "zod";
import { GET, PATCH, POST } from "../api";
import {
  ChangeCandidateStatusResponse,
  MultiCandidateResponse,
  SingleCandidateResponse,
} from "./type";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";

export const getAllCandidates = async (): Promise<MultiCandidateResponse> => {
  const response = await GET("/candidates");
  return response;
};

export const getCandidateById = async (
  id: string,
): Promise<SingleCandidateResponse> => {
  const response = await GET(`/candidates/${id}`);
  return response;
};

export const getEligibleCandidates = async (
  status?: string | null,
): Promise<MultiCandidateResponse> => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  const response = await GET(`/candidates/eligible`, params);
  return response;
};

export const createCandidate = async (
  data: z.infer<typeof candidateSchema>,
): Promise<SingleCandidateResponse> => {
  const response = await POST("/candidates", data);
  return response;
};

export const editCandidate = async (
  id: string,
  data: z.infer<typeof candidateSchema>,
): Promise<SingleCandidateResponse> => {
  const response = await PATCH(`/candidates/${id}`, data);
  return response;
};

export const changeCandidateStatus = async (
  candidateId: string,
  stepId: string,
): Promise<ChangeCandidateStatusResponse> => {
  const response = await PATCH(`/candidates/${candidateId}/status`, { stepId });
  return response;
};

export const hireCandidate = async (
  id: string,
): Promise<SingleCandidateResponse> => {
  const response = await POST(`/candidates/${id}/hire`);
  return response;
};

export const rejectCandidate = async (
  id: string,
): Promise<SingleCandidateResponse> => {
  const response = await POST(`/candidates/${id}/reject`);
  return response;
};

export const blacklistCandidate = async (
  id: string,
): Promise<SingleCandidateResponse> => {
  const response = await POST(`/candidates/${id}/blacklist`);
  return response;
};
