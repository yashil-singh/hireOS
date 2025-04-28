import { Assessment } from "@/lib/types";

export const Asssessments: Assessment[] = [
  {
    id: "assessment-1",
    title: "Assessment Title 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    date: new Date().toDateString(),
    candidates: [
      { id: "123", name: "Peter Parker" },
      { id: "456", name: "Peter Parker" },
      { id: "789", name: "Peter Parker" },
      { id: "1011", name: "Peter Parker" },
      { id: "1213", name: "Peter Parker" },
      { id: "1415", name: "Peter Parker" },
    ],
    format: "link",
    type: "technical",
    link: "",
  },
  {
    id: "assessment-2",
    title: "Assessment Title 2",
    description: "",
    date: new Date().toDateString(),
    candidates: [
      { id: "123", name: "Peter Parker" },
      { id: "456", name: "Peter Parker" },
      { id: "789", name: "Peter Parker" },
      { id: "1011", name: "Peter Parker" },
      { id: "1213", name: "Peter Parker" },
      { id: "1415", name: "Peter Parker" },
    ],
    format: "file",
    type: "technical",
    fileUrl: "",
  },
];
