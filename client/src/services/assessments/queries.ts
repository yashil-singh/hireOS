import { useQuery } from "@tanstack/react-query";
import {
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByCandidateId,
} from ".";
import { assessmentKeys } from "./keys";

export const useGetAllAssessments = () => {
  return useQuery({
    queryFn: getAllAssessments,
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
