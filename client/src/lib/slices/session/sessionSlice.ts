import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionState, User } from "./types";

const initialState: SessionState = {
  user: null,
  loading: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = sessionSlice.actions;
export default sessionSlice.reducer;
