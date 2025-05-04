import { CandidatePreview } from "@/services/candidates/type";
import { HiringProcessStep } from "@/services/hiringProcess/types";
import { LucideIcon } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

export type NavLink = {
  title: string;
  Icon: LucideIcon;
  to: string;
  hasChild: boolean;
  children?: {
    title: string;
    to: string;
    Icon: LucideIcon;
  }[];
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  step?: HiringProcessStep;
  status: "completed" | "pending" | "rejected";
  activities: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
  createdAt: string;
};

export type Assessment = {
  id: string;
  title: string;
  description: string;
  date: string;
  candidates: { id: string; name: string }[];
  type: string;
  format: "link" | "file";
  fileUrl?: string;
  link?: string;
};

export type Draft = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type Letter = {
  id: string;
  candidate: CandidatePreview;
  draft: Draft;
  content: string;
  createdAt: string;
};
