export type DataView = "list" | "grid";

export type DataViewState = {
  candidates: DataView;
  interviews: DataView;
  interviewers: DataView;
  assessments: DataView;
  letters: DataView;
  drafts: DataView;
};
