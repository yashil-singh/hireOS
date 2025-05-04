import { useQuery } from "@tanstack/react-query";
import { getEventsByCandidateId } from ".";
import { eventKeys } from "./keys";

export const useGetEventsByCandidateId = (id: string) => {
  return useQuery({
    queryFn: () => getEventsByCandidateId(id),
    queryKey: eventKeys.candidate(id),
    enabled: !!id,
  });
};
