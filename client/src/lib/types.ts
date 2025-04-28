import { LucideIcon } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

export type NavLink = {
  title: string;
  Icon: LucideIcon;
  to: string;
};

export type Experience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: number;
};

export type Candidate = {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: string;
  avatarUrl?: string;
  technology: string[];
  references: string[];
  experience: Experience[];
  salaryExpectation: string;
  status: string;
  resumeUrl: string;
};

export type CandidatePreview = Pick<
  Candidate,
  "id" | "name" | "email" | "avatarUrl"
>;

export type Event = {
  title: string;
  status: "completed" | "pending" | "rejected";
  timestamp: string;
  events: { description: string; timestamp: string }[];
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
