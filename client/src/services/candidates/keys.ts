export const candidateKeys = {
  all: (params: URLSearchParams = new URLSearchParams()) => [
    "candidates",
    params.toString(),
  ],
  detail: (id: string) => ["candidates", id],
  eligible: () => ["candidates", "eligible"],
  eligibleWithStatus: (status?: string) => ["candidates", "eligible", status],
  search: (query: string) => ["candidates", "search", query],
};
