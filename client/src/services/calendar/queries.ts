import { useQuery } from "@tanstack/react-query";
import {
  getAllCalendarEvents,
  getCalendarEventByCandidateId,
  getCalendarEventById,
} from ".";
import { calendarKeys } from "./keys";

export const useGetAllCalenderEvents = (params?: Record<string, string>) => {
  const queryParams = new URLSearchParams(params);

  return useQuery({
    queryFn: () => getAllCalendarEvents(queryParams),
    queryKey: calendarKeys.all(queryParams.toString()),
  });
};

export const useGetCalendarEventById = (id: string) => {
  return useQuery({
    queryFn: () => getCalendarEventById(id),
    queryKey: calendarKeys.detail(id),
    enabled: !!id,
  });
};

export const useGetCalendarEventsByCandidateId = (id: string) => {
  return useQuery({
    queryFn: () => getCalendarEventByCandidateId(id),
    queryKey: calendarKeys.candidate(id),
    enabled: !!id,
  });
};
