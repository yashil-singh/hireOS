import Logo from "@/assets/images/logo.png";
import Favicon from "@/assets/images/favicon.png";
import SearchingImage from "@/assets/images/searching.svg";
import Profiling from "@/assets/images/profiling.svg";
import GoogleLogo from "@/assets/images/google-icon.svg";
import AvatarPlaceholder from "@/assets/images/avatar-placeholder.png";

import { NavLink } from "./types";
import {
  CalendarDays,
  FileText,
  FileUser,
  LayoutDashboard,
  ListChecks,
  Settings,
} from "lucide-react";

const NavLinks: NavLink[] = [
  {
    title: "Dashboard",
    to: "/",
    Icon: LayoutDashboard,
  },
  {
    title: "Candidate Profile",
    to: "/candidate-profiles",
    Icon: FileUser,
  },
  {
    title: "Assessments",
    to: "/assessments",
    Icon: ListChecks,
  },
  {
    title: "Offer Letters",
    to: "/offer-letters",
    Icon: FileText,
  },
  {
    title: "Interviews",
    to: "/interviews",
    Icon: CalendarDays,
  },
  {
    title: "Settings",
    to: "/settings",
    Icon: Settings,
  },
];

const CandidateLevels = [
  "Intern",
  "Trainee",
  "Associate",
  "Junior",
  "Mid-Level",
  "Senior",
];

const CandidateStatus: { label: string; value: string }[] = [
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

const Technologies: { label: string; value: string }[] = [
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export {
  Logo,
  Favicon,
  NavLinks,
  SearchingImage,
  Profiling,
  GoogleLogo,
  AvatarPlaceholder,
  CandidateLevels,
  Technologies,
  CandidateStatus,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
};
