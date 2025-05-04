export const interviewerKeys = {
  all: () => ["interviewers"],
  available: () => ["interviewers", "available"],
  detail: (id: string) => ["interviewers", id],
};
