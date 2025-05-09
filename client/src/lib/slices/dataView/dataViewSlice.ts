import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataView, DataViewState } from "./types";

const initialState: DataViewState = {
  candidates: "list",
  interviews: "list",
  interviewers: "grid",
  assessments: "grid",
  letters: "list",
  drafts: "grid",
};

const dataViewSlice = createSlice({
  name: "dataView",
  initialState,
  reducers: {
    setDataView: (
      state,
      action: PayloadAction<{ section: keyof DataViewState; view: DataView }>,
    ) => {
      const { section, view } = action.payload;
      state[section] = view;
    },
  },
});

export const { setDataView } = dataViewSlice.actions;
export default dataViewSlice.reducer;
