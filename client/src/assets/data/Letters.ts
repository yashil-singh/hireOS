import { Letter } from "@/lib/types";
import Drafts from "./Drafts";

const Letters: Letter[] = [
  {
    id: "letter-1",
    candidate: {
      id: "candidate-1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    },
    draft: Drafts[0], // Offer
    content:
      "Dear Alice Johnson,\n\nWe are excited to offer you the position at our company. Welcome aboard!\n\nBest Regards,\nHR Team",
    createdAt: "2025-04-05T14:00:00Z",
  },
  {
    id: "letter-2",
    candidate: {
      id: "candidate-2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
    },
    draft: Drafts[1], // Rejection
    content:
      "Dear Bob Smith,\n\nThank you for your interest. Unfortunately, we have decided to move forward with other candidates.\n\nBest wishes,\nHR Team",
    createdAt: "2025-04-05T15:00:00Z",
  },
  {
    id: "letter-3",
    candidate: {
      id: "candidate-3",
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
    },
    draft: Drafts[0], // Offer
    content:
      "Dear Charlie Davis,\n\nWe are excited to offer you the position at our company. Welcome aboard!\n\nBest Regards,\nHR Team",
    createdAt: "2025-04-06T10:30:00Z",
  },
  {
    id: "letter-4",
    candidate: {
      id: "candidate-4",
      name: "Diana Prince",
      email: "diana.prince@example.com",
    },
    draft: Drafts[1], // Rejection
    content:
      "Dear Diana Prince,\n\nThank you for your interest. Unfortunately, we have decided to move forward with other candidates.\n\nBest wishes,\nHR Team",
    createdAt: "2025-04-06T11:45:00Z",
  },
  {
    id: "letter-5",
    candidate: {
      id: "candidate-5",
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
    },
    draft: Drafts[0], // Offer
    content:
      "Dear Ethan Hunt,\n\nWe are excited to offer you the position at our company. Welcome aboard!\n\nBest Regards,\nHR Team",
    createdAt: "2025-04-07T09:20:00Z",
  },
];

export default Letters;
