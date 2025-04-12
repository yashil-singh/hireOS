import Logo from "@/assets/images/logo.png";
import Favicon from "@/assets/images/favicon.png";
import SearchingImage from "@/assets/images/searching.svg";
import { NavLink } from "./types";
import {
  CalendarDays,
  FileText,
  FileUser,
  LayoutDashboard,
  ListChecks,
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
];

export { Logo, Favicon, NavLinks, SearchingImage };
