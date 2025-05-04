export const eventKeys = {
  all: () => ["events"],
  detail: (id: string) => ["events", id],
  candidate: (id: string) => ["events", "candidate", id],
};
