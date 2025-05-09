import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInterviewer, editInterviewer } from ".";
import { toast } from "sonner";
import { interviewerKeys } from "./keys";
import { InterviewerFormValues } from "./types";

export const useCreateInteriviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterviewer,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: interviewerKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useEditInterviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: InterviewerFormValues;
    }) => editInterviewer(id, values),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: interviewerKeys.all(),
      });
    },
    onError: ({ message }) => toast.error(message),
  });
};
