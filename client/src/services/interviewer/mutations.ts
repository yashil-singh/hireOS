import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInterviewer } from ".";
import { toast } from "sonner";
import { interviewerKeys } from "./keys";

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
