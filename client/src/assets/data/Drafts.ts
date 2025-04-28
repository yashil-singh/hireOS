import { Draft } from "@/lib/types";

const Drafts: Draft[] = [
  {
    id: "draft-1",
    title: "Job Offer Letter",
    content:
      "Dear {{candidate_name}},\n\nWe are excited to offer you the position at our company. Welcome aboard!\n\nBest Regards,\nHR Team",
    createdAt: "2025-04-01T09:00:00Z",
    updatedAt: "2025-04-02T10:00:00Z",
  },
  {
    id: "draft-2",
    title: "Job Rejection Letter",
    content:
      "Dear {{candidate_name}},\n\nThank you for your interest. Unfortunately, we have decided to move forward with other candidates.\n\nBest wishes,\nHR Team",
    createdAt: "2025-04-03T08:30:00Z",
    updatedAt: "2025-04-03T08:30:00Z",
  },
];

export default Drafts;
