import { useQuery } from "@tanstack/react-query";
import { getAllLetters, getLetterById } from ".";
import { letterKeys } from "./keys";

export const useGetAllLetters = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});

  return useQuery({
    queryFn: () => getAllLetters(searchParams),
    queryKey: letterKeys.all(searchParams),
  });
};

export const useGetLetterById = (id: string) => {
  return useQuery({
    queryFn: () => getLetterById(id),
    queryKey: letterKeys.detail(id),
    enabled: !!id,
  });
};
