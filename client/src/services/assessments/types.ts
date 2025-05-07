import {
  assessmentSchema,
  assignAssessmentSchema,
  evaluateAssessmentSchema,
} from "@/lib/schemas/assessmentSchemas";
import { z } from "zod";
import { Candidate, CandidatePreview } from "../candidates/type";
import { Timestamps } from "@/lib/types";

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;
export type AssignAssessmentFormValues = z.infer<typeof assignAssessmentSchema>;
export type EvaluateAssessmentFormValues = z.infer<
  typeof evaluateAssessmentSchema
>;

export interface Assignment extends Timestamps {
  _id: string;
  remarks?: string;
  rating?: number;
  status: "pending" | "evaluated";
  candidate: Candidate;
  interviewer: CandidatePreview;
  deadlineDate: Date;
  deadlineTime: Date;
}

export interface Assessment extends Timestamps {
  _id: string;
  title: string;
  description?: string;
  technologies: string[];
  assessmentType: string;
  format: "link" | "file";
  fileUrl?: string;
  link?: string;
  assignments: Assignment[];
}

export type SingleAssessmentResponse = {
  message: string;
  data: Assessment;
};

export type MultiAssessmentResponse = {
  message: string;
  data: Assessment[];
};
