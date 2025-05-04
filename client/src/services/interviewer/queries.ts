import { useQuery } from "@tanstack/react-query";
import { getAllInterviewers } from ".";
import { interviewerKeys } from "./keys";

export const useGetAllInterviewers = () => {
  return useQuery({
    queryFn: getAllInterviewers,
    queryKey: interviewerKeys.all(),
  });
};
