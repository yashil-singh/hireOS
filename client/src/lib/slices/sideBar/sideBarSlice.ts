import { createSlice } from "@reduxjs/toolkit";
import { SideBarState } from "./types";

const initialState: SideBarState = {
  isCollapsed: false,
};

export const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const { toggleCollapse } = sideBarSlice.actions;
export default sideBarSlice.reducer;
