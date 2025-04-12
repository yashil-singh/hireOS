import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeState } from "./types";

const initialState: ThemeState = {
  theme: "system",
  isDark: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkTheme: (state) => {
      state.theme = "dark";
      state.isDark = true;
    },
    setLightTheme: (state) => {
      state.theme = "light";
      state.isDark = true;
    },
    setSystemTheme: (state) => {
      state.theme = "system";
    },
    setIsDark: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
  },
});

export const { setDarkTheme, setLightTheme, setSystemTheme, setIsDark } =
  themeSlice.actions;
export default themeSlice.reducer;
