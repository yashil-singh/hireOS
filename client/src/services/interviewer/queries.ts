import { useQuery } from "@tanstack/react-query";
import { getAllInterviewers } from ".";
import { interviewerKeys } from "./keys";

export const useGetAllInterviewers = (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});

  return useQuery({
    queryFn: () => getAllInterviewers(searchParams),
    queryKey: interviewerKeys.all(),
  });
};
