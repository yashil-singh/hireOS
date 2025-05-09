import Logo from "@/assets/images/logo.png";
import Favicon from "@/assets/images/favicon.png";
import SearchingImage from "@/assets/images/searching.svg";
import Profiling from "@/assets/images/profiling.svg";
import GoogleLogo from "@/assets/images/google-icon.svg";
import AvatarPlaceholder from "@/assets/images/avatar-placeholder.png";
import NoDataImage from "@/assets/images/empty.svg";

import { NavLink, SelectOption } from "./types";
import {
  CalendarDays,
  FilePen,
  FileText,
  FileUser,
  LayoutDashboard,
  ListChecks,
  Send,
  Settings,
  Speech,
  Upload,
  Users,
} from "lucide-react";

const NavLinks: NavLink[] = [
  {
    title: "Dashboard",
    to: "/",
    Icon: LayoutDashboard,
    hasChild: false,
  },
  {
    title: "Candidates",
    to: "/candidates",
    Icon: FileUser,
    hasChild: true,
    children: [
      {
        title: "Upload CV",
        to: "/candidates/add",
        Icon: Upload,
      },
    ],
  },
  {
    title: "Calendar",
    to: "/calendar",
    Icon: CalendarDays,
    hasChild: true,
    children: [
      {
        title: "Interviews",
        to: "/interviews",
        Icon: Speech,
      },
      {
        title: "Interviewers",
        to: "/interviewers",
        Icon: Users,
      },
    ],
  },
  {
    title: "Assessments",
    to: "/assessments",
    Icon: ListChecks,
    hasChild: false,
  },
  {
    title: "Letters",
    to: "/letters",
    Icon: FileText,
    hasChild: true,
    children: [
      {
        title: "Send Letter",
        to: "/letters/send",
        Icon: Send,
      },
      {
        title: "Drafts",
        to: "/letters/drafts",
        Icon: FilePen,
      },
    ],
  },
  {
    title: "Settings",
    to: "/settings",
    Icon: Settings,
    hasChild: false,
  },
];

const CandidateLevels = [
  { label: "Intern", value: "intern" },
  { label: "Trainee", value: "trainee" },
  { label: "Associate", value: "associate" },
  { label: "Junior", value: "junior" },
  { label: "Mid-Level", value: "mid-level" },
  { label: "Senior", value: "senior" },
];

const CandidateStatus: SelectOption[] = [
  {
    label: "Short-Listed",
    value: "short-listed",
  },
  {
    label: "Interviewing",
    value: "interviewing",
  },
  {
    label: "Hired",
    value: "hired",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

const Technologies: SelectOption[] = [
  { label: "ReactJS", value: "react" },
  { label: "Next.js", value: "next" },
  { label: "Node.js", value: "node" },
  { label: "Express.js", value: "express" },
  { label: "Vue.js", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Tailwind CSS", value: "tailwind" },
  { label: "Sass", value: "sass" },
  { label: "Bootstrap", value: "bootstrap" },
  { label: "MongoDB", value: "mongodb" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "Firebase", value: "firebase" },
  { label: "Redux", value: "redux" },
  { label: "Zustand", value: "zustand" },
  { label: "GraphQL", value: "graphql" },
  { label: "Docker", value: "docker" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "Jest", value: "jest" },
  { label: "Cypress", value: "cypress" },
  { label: "Git", value: "git" },
  { label: "Figma", value: "figma" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: ".NET", value: "dotnet" },
];

const AssessmentTypes: SelectOption[] = [
  {
    label: "Technical",
    value: "technical",
  },
  {
    label: "Aptitude",
    value: "aptitude",
  },
  {
    label: "Personality",
    value: "personality",
  },
  {
    label: "Behavioral",
    value: "behavioral",
  },
];

const HIRING_STEPS: string[] = [
  "First Interview",
  "Second Interview",
  "Third Interview",
  "Assessment",
  "Background Check",
  "Offer Letter",
];

export const interviewStatusColor = {
  scheduled:
    "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500",
  completed:
    "text-green-500 bg-green-500/10 dark:bg-green-500/20 border border-green-500",
  rescheduled:
    "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500",
  cancelled:
    "text-destructive bg-destructive/10 dark:bg-destructive/20 border border-destructive",
};

export const candidateStatusColors = {
  shortlisted:
    "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500",
  interview:
    "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500",
  assessment:
    "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500",
  offer:
    "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500",
  rejected:
    "text-destructive bg-destructive/10 dark:bg-destructive/20 border border-destructive",
  hired:
    "text-green-500 bg-green-500/10 dark:bg-green-500/20 border border-green-500",
};

const BASE_API_URL = "https://hireos.onrender.com/api";
// const BASE_API_URL = "http://localhost:3000/api";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const DEFAULT_DATE_FORMAT = "do MMMM yyyy";
const DEFAULT_TIME_FORMAT = "hh:mm a";

export {
  Logo,
  Favicon,
  NavLinks,
  SearchingImage,
  NoDataImage,
  Profiling,
  GoogleLogo,
  AvatarPlaceholder,
  CandidateLevels,
  Technologies,
  CandidateStatus,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  BASE_API_URL,
  HIRING_STEPS,
  AssessmentTypes,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
};
