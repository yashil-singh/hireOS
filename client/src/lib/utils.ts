import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimelineDate(date: string) {
  return format(new Date(date), "MMM yyyy");
}

export function extractVariables(template: string): string[] {
  const regex = /{{\s*([^}]+?)\s*}}/g;
  const matches = [...template.matchAll(regex)];
  const variables = matches.map((match) => match[0].trim());

  return [...new Set(variables)];
}

export function replaceVariables(
  content: string,
  variables: Record<string, string | undefined>,
) {
  return content.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return variables[trimmedKey] ?? `{{${trimmedKey}}}`;
  });
}

export function replaceVariable(
  template: string,
  variable: string,
  value: string,
): string {
  const pattern = new RegExp(`{{\\s*${variable}\\s*}}`, "g");
  return template.replace(pattern, value);
}

export function normalizeCandidateStatus(status: string) {
  const normalizedStatus = status.includes("interview")
    ? "interview"
    : status.replace("-", "");

  return normalizedStatus;
}
