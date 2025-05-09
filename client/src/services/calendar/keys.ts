export const calendarKeys = {
  all: (params?: string) => ["calendar-events", params],
  detail: (id: string) => ["calendar-events", id],
  candidate: (id: string) => ["calendar-events", "candidate", id],
};
