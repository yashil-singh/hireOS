export const draftKeys = {
  all: (params: URLSearchParams = new URLSearchParams()) => [
    "drafts",
    params.toString(),
  ],
  detail: (id: string) => ["drafts", id],
};

export const draftVariableKeys = {
  all: (params: URLSearchParams = new URLSearchParams()) => [
    "draftVariabels",
    params.toString(),
  ],
  detail: (id: string) => ["draftVariabels", id],
};
