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
