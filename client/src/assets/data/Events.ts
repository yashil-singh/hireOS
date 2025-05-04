import { CalendarEvent } from "@/services/calendar/types";

export const Events: CalendarEvent[] = [
  {
    _id: "evt-001",
    title: "Frontend Developer Interview",
    interviewers: [
      {
        _id: "int-001",
        name: "Alice Johnson",
        email: "alice@company.com",
        avatarUrl: "/avatars/alice.jpg",
        phone: "98647288241",
      },
      {
        _id: "int-002",
        name: "Bob Smith",
        email: "bob@company.com",
        avatarUrl: "/avatars/bob.jpg",
        phone: "98647288241",
      },
    ],
    candidate: {
      _id: "cand-001",
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
      avatarUrl: "/avatars/jane.jpg",
      phone: "98647288241",
    },
    start: "2025-05-02T10:00:00Z",
    end: "2025-05-02T11:00:00Z",
  },
  {
    _id: "evt-002",
    title: "Backend Developer Interview",
    interviewers: [
      {
        _id: "int-003",
        name: "Charlie Ray",
        email: "charlie@company.com",
        avatarUrl: "/avatars/charlie.jpg",
        phone: "98647288241",
      },
    ],
    candidate: {
      _id: "cand-002",
      name: "Tom Hardy",
      email: "tom.hardy@gmail.com",
      avatarUrl: "/avatars/tom.jpg",
      phone: "98647288241",
    },
    start: "2025-05-02T13:00:00Z",
    end: "2025-05-02T14:00:00Z",
  },
];

export default Events;
