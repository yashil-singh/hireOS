import { useQuery } from "@tanstack/react-query";
import { getAllLetters, getLetterById } from ".";
import { letterKeys } from "./keys";

export const useGetAllLetters = () => {
  return useQuery({
    queryFn: getAllLetters,
    queryKey: letterKeys.all(),
  });
};

export const useGetLetterById = (id: string) => {
  return useQuery({
    queryFn: () => getLetterById(id),
    queryKey: letterKeys.detail(id),
    enabled: !!id,
  });
};
