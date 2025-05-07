import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markInterviewAsCompleted,
  rescheduleInterview,
  scheduleInterview,
  sendInterviewReminder,
} from ".";
import { calendarKeys } from "./keys";
import { toast } from "sonner";
import { rescheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
import { z } from "zod";
import { eventKeys } from "../events/keys";
import { dashboardKeys } from "../dashboard/keys";

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleInterview,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: calendarKeys.all() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useRescheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof rescheduleInterviewSchema>;
    }) => rescheduleInterview(id, data),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: calendarKeys.all() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useMarkInterviewAsCompleted = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markInterviewAsCompleted(id),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(id) });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useSendInterviewReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendInterviewReminder,
    onSuccess: ({ message, data }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: calendarKeys.detail(data._id),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.candidate(data.candidate._id),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};
