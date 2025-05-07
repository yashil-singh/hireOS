import {
  draftFormSchema,
  draftVariableFormSchema,
} from "@/lib/schemas/letterSchemas";
import { Timestamps } from "@/lib/types";
import { z } from "zod";

export type DraftFormValues = z.infer<typeof draftFormSchema>;
export type DraftVariableFormValues = z.infer<typeof draftVariableFormSchema>;

export interface DraftVariable extends Timestamps {
  _id: string;
  key: string;
  label: string;
  description?: string;
  isSystem: boolean;
}

export interface Draft extends Timestamps {
  _id: string;
  title: string;
  content: string;
  variables: DraftVariable[];
  type: "offer" | "rejection" | "others";
  isSystem: boolean;
  isDefault: boolean;
}

export type SingleDraftResponse = {
  message: string;
  data: Draft;
};

export type MultiDraftResponse = {
  message: string;
  data: Draft[];
};

export type SingleDraftVariableResponse = {
  message: string;
  data: DraftVariable;
};

export type MultiDraftVariableResponse = {
  message: string;
  data: DraftVariable[];
};
