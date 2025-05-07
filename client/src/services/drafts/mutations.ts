import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft, createDraftVariable, editDraft } from ".";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { draftKeys, draftVariableKeys } from "./keys";
import { DraftFormValues } from "./types";

export const useCreateDraft = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraft,
    onSuccess: ({ data, message }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/letters/drafts/${data._id}`),
        },
      });
      queryClient.invalidateQueries({ queryKey: draftKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useEditDraft = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: DraftFormValues }) =>
      editDraft(id, values),
    onSuccess: ({ data, message }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/letters/drafts/${data._id}`),
        },
      });
      queryClient.invalidateQueries({ queryKey: draftKeys.detail(data._id) });
    },
  });
};

export const useCreateDraftVariable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraftVariable,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: draftVariableKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};
