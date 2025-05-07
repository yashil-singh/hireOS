import { GET, POST } from "../api";
import {
  AssessmentFormValues,
  AssignAssessmentFormValues,
  EvaluateAssessmentFormValues,
  MultiAssessmentResponse,
  SingleAssessmentResponse,
} from "./types";

const BASE = "/assessments";

export const getAllAssessments = async (): Promise<MultiAssessmentResponse> => {
  const response = await GET(`${BASE}`);
  return response;
};

export const getAssessmentById = async (
  id: string,
): Promise<SingleAssessmentResponse> => {
  const response = await GET(`${BASE}/${id}`);
  return response;
};

export const getAssessmentsByCandidateId = async (
  id: string,
): Promise<MultiAssessmentResponse> => {
  const response = await GET(`${BASE}/candidate/${id}`);
  return response;
};

export const createAssessment = async (
  data: AssessmentFormValues,
): Promise<SingleAssessmentResponse> => {
  const response = await POST(`${BASE}`, data);
  return response;
};

export const assignAssessment = async (
  id: string,
  data: AssignAssessmentFormValues,
): Promise<SingleAssessmentResponse> => {
  const response = await POST(`${BASE}/${id}/assign`, data);
  return response;
};

export const evaluataeAssessment = async (
  assessmentId: string,
  candidateId: string,
  data: EvaluateAssessmentFormValues,
): Promise<SingleAssessmentResponse> => {
  const response = await POST(
    `${BASE}/${assessmentId}/candidate/${candidateId}/evaluate`,
    data,
  );
  return response;
};

export const deleteAssessment = async () => {};
