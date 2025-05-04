export const candidateKeys = {
  all: () => ["candidates"],
  detail: (id: string) => ["candidates", id],
  eligible: () => ["candidates", "eligible"],
  eligibleWithStatus: (status?: string) => ["candidates", "eligible", status],
};
