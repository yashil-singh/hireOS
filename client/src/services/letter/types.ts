import { Timestamps } from "@/lib/types";
import { Draft } from "../drafts/types";
import { CandidatePreview } from "../candidates/type";
import { z } from "zod";
import { letterFormSchema } from "@/lib/schemas/letterSchemas";

export type LetterFormValues = z.infer<typeof letterFormSchema>;

export interface Letter extends Timestamps {
  _id: string;
  candidate: CandidatePreview;
  draft: Draft;
  content: string;
}

export type SingleLetterResponse = {
  message: string;
  data: Letter;
};

export type MultiLetterResponse = {
  message: string;
  data: Letter[];
};
