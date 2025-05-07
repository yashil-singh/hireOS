import { Candidate } from "@/services/candidates/type";
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

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  _id: string;
  title: string;
  candidate: Candidate;
  description: string;
  step?: HiringProcessStep;
  status: "completed" | "pending" | "rejected" | "cancelled";
  activities: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
  createdAt: string;
};
