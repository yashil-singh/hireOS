import { useQuery } from "@tanstack/react-query";
import { getAllDrafts, getAllDraftVariables, getDraftById } from ".";
import { draftKeys, draftVariableKeys } from "./keys";

export const useGetAllDrafts = () => {
  return useQuery({
    queryFn: getAllDrafts,
    queryKey: draftKeys.all(),
  });
};

export const useGetDraftById = (id: string) => {
  return useQuery({
    queryFn: () => getDraftById(id),
    queryKey: draftKeys.detail(id),
    enabled: !!id,
  });
};

export const useGetDraftVariables = () => {
  return useQuery({
    queryFn: getAllDraftVariables,
    queryKey: draftVariableKeys.all(),
  });
};
