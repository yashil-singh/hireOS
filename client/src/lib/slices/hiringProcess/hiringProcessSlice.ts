import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HiringProcessStepsState } from "./types";
import { HiringProcessStep } from "@/services/hiringProcess/types";

const initialState: HiringProcessStepsState = {
  loading: true,
  steps: [],
};

const hiringProcessSlice = createSlice({
  name: "hiring-process",
  initialState,
  reducers: {
    setHiringProcess: (state, action: PayloadAction<HiringProcessStep[]>) => {
      state.steps = action.payload;
      state.loading = false;
    },
  },
});

export const { setHiringProcess } = hiringProcessSlice.actions;
export default hiringProcessSlice.reducer;
