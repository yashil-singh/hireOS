import { useQuery } from "@tanstack/react-query";
import {
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByCandidateId,
} from ".";
import { assessmentKeys } from "./keys";

export const useGetAllAssessments = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});

  return useQuery({
    queryFn: () => getAllAssessments(searchParams),
    queryKey: assessmentKeys.all(),
  });
};

export const useGetAssessmentById = (id: string) => {
  return useQuery({
    queryFn: () => getAssessmentById(id),
    queryKey: assessmentKeys.detail(id),
    enabled: !!id,
  });
};

export const useGetAssessmentsByCandidateId = (id: string) => {
  return useQuery({
    queryFn: () => getAssessmentsByCandidateId(id),
    queryKey: assessmentKeys.candidate(id),
    enabled: !!id,
  });
};
