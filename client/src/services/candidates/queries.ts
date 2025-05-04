import { useQuery } from "@tanstack/react-query";
import { getAllCandidates, getCandidateById, getEligibleCandidates } from ".";
import { candidateKeys } from "./keys";

export const useGetAllCandidates = () => {
  return useQuery({
    queryFn: getAllCandidates,
    queryKey: candidateKeys.all(),
  });
};

export const useGetCandidateById = (id: string) => {
  return useQuery({
    queryFn: () => getCandidateById(id),
    queryKey: candidateKeys.detail(id),
    enabled: !!id,
    retry: false,
  });
};

export const useGetEligibleCandidates = (status?: string) => {
  return useQuery({
    queryFn: () => getEligibleCandidates(status),
    queryKey: candidateKeys.eligibleWithStatus(status),
  });
};
