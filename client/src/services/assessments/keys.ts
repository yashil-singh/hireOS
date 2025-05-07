export const assessmentKeys = {
  all: () => ["assessments"],
  detail: (id: string) => ["assessments", id],
  candidate: (id: string) => ["assessments", "candidate", id],
};
