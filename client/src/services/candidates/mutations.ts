import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeCandidateStatus,
  createCandidate,
  editCandidate,
  hireCandidate,
  rejectCandidate,
} from ".";
import { toast } from "sonner";
import { candidateKeys } from "./keys";
import { useNavigate } from "react-router-dom";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { z } from "zod";
import { eventKeys } from "../events/keys";
import { dashboardKeys } from "../dashboard/keys";

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCandidate,
    onSuccess: ({ data, message }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/candidates/${data._id}`),
        },
      });
      queryClient.invalidateQueries({ queryKey: candidateKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useEditCandidate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (candidateData: {
      id: string;
      data: z.infer<typeof candidateSchema>;
    }) => editCandidate(candidateData.id, candidateData.data),
    onSuccess: ({ data, message }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/candidates/${data._id}`),
        },
      });
      queryClient.invalidateQueries({
        queryKey: candidateKeys.detail(data._id),
      });
      queryClient.invalidateQueries({ queryKey: candidateKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useChangeCandidateStatus = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      candidateId,
      stepId,
    }: {
      candidateId: string;
      stepId: string;
    }) => changeCandidateStatus(candidateId, stepId),
    onSuccess: ({ data, message }) => {
      const { type, candidate } = data;

      let label;
      let link;

      switch (type) {
        case "assessment":
          label = "Assign Assessment";
          link = `/assessments?candidate=${candidate._id}`;
          break;
        case "interview":
          label = "Schedule Interview";
          link = `/calendar?schedule=true&candidate=${candidate._id}`;
          break;
        case "letter":
          label = "Generate Letter";
          link = `/letters/send?candidate=${candidate._id}&type=offer`;
          break;
      }
      toast.success(message, {
        ...(label &&
          link && {
            action: {
              label,
              onClick: () => navigate(link),
            },
          }),
      });

      queryClient.invalidateQueries({
        queryKey: candidateKeys.detail(candidate._id),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.candidate(candidate._id),
      });
    },
  });
};

export const useHireCandidate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: hireCandidate,
    onSuccess: ({ message, data }) => {
      toast.success(message, {
        action: {
          label: "Send Letter",
          onClick: () =>
            navigate(`/letters/send?candidate=${data._id}&type=offer`),
        },
      });
      queryClient.invalidateQueries({
        queryKey: candidateKeys.detail(data._id),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.candidate(data._id),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useRejectCandidate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: rejectCandidate,
    onSuccess: ({ message, data }) => {
      toast.success(message, {
        action: {
          label: "Send Letter",
          onClick: () =>
            navigate(`/letters/send?candidate=${data._id}&type=rejection`),
        },
      });
      queryClient.invalidateQueries({
        queryKey: candidateKeys.detail(data._id),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.candidate(data._id),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};
