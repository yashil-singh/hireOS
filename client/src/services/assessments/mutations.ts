import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignAssessment, createAssessment, evaluataeAssessment } from ".";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { assessmentKeys } from "./keys";
import {
  AssignAssessmentFormValues,
  EvaluateAssessmentFormValues,
} from "./types";
import { CandidatePreview } from "../candidates/type";

export const useCreateAssessment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssessment,
    onSuccess: ({ message, data: assessment }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/assessments/${assessment._id}`),
        },
      });

      queryClient.invalidateQueries({ queryKey: assessmentKeys.all() });
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useAssignAssessment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AssignAssessmentFormValues;
    }) => assignAssessment(id, data),
    onSuccess: ({ message, data }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/assessments/${data._id}`),
        },
      });
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(data._id),
      });
    },
    onError: (error: {
      message: string;
      status?: number;
      data?: { message: string; candidates?: CandidatePreview[] };
    }) => {
      if (error.data) {
        if (error.data.candidates) {
          toast.error(error.message, {
            description: error.data.candidates
              .map((c) => `${c.name} - ${c.email}`)
              .join(", "),
          });
        }
      }
    },
  });
};

export const useEvaluateAssessment = (assessmentId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      candidateId,
      data,
    }: {
      assessmentId: string;
      candidateId: string;
      data: EvaluateAssessmentFormValues;
    }) => evaluataeAssessment(assessmentId, candidateId, data),
    onSuccess: ({ data, message }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/assessments/${data._id}`),
        },
      });

      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(assessmentId),
      });
    },
    onError: ({ message }) => toast.error(message),
  });
};
