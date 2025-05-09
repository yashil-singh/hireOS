import { useQuery } from "@tanstack/react-query";
import {
  getAllCandidates,
  getCandidateById,
  getEligibleCandidates,
  searchCandidates,
} from ".";
import { candidateKeys } from "./keys";

export const useGetAllCandidates = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});

  return useQuery({
    queryFn: () => getAllCandidates(searchParams),
    queryKey: candidateKeys.all(searchParams),
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
    queryKey: candidateKeys.eligibleWithStatus(status ?? ""),
  });
};

export const useSearchCandidates = (query: string) => {
  return useQuery({
    queryFn: () => searchCandidates(query),
    queryKey: candidateKeys.search(query),
    enabled: false,
  });
};
