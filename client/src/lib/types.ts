import { LucideIcon } from "lucide-react";

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
  technology: string[];
  references: string[];
  experience: Experience[];
  salaryExpectation: string;
  status: string;
  resumeUrl: string;
};
