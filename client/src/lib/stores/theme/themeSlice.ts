import { createSlice } from "@reduxjs/toolkit";
import { ThemeState } from "./types";

const initialState: ThemeState = {
  theme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkTheme: (state) => {
      state.theme = "dark";
    },
    setLightTheme: (state) => {
      state.theme = "light";
    },
    setSystemTheme: (state) => {
      state.theme = "system";
    },
  },
});

export const { setDarkTheme, setLightTheme, setSystemTheme } =
  themeSlice.actions;
export default themeSlice.reducer;
