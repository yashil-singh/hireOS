export const letterKeys = {
  all: (params: URLSearchParams = new URLSearchParams()) => [
    "letters",
    params.toString(),
  ],
  detail: (id: string) => ["letters", id],
};
