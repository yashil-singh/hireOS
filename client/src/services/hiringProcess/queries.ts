import { useQuery } from "@tanstack/react-query";
import { getAllHiringProcessSteps, getHiringProcessStepById } from ".";
import { hiringProcessKeys } from "./keys";

export const useGetAllHiringProcessSteps = () => {
  return useQuery({
    queryFn: getAllHiringProcessSteps,
    queryKey: hiringProcessKeys.all(),
  });
};

export const useGetHiringProcessStepById = (id: string) => {
  return useQuery({
    queryFn: () => getHiringProcessStepById(id),
    queryKey: hiringProcessKeys.detail(id),
  });
};
