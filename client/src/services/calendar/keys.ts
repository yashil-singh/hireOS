export const calendarKeys = {
  all: () => ["calendar-events"],
  detail: (id: string) => ["calendar-events", id],
  candidate: (id: string) => ["calendar-events", "candidate", id],
};
