import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchHistoryState } from "./types";
import { Candidate } from "@/services/candidates/type";

const initialState: SearchHistoryState = {
  results: [],
};

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    setSearchHistory: (state, action: PayloadAction<Candidate[]>) => {
      state.results = action.payload;
    },
    appendSearchHistory: (state, action: PayloadAction<Candidate>) => {
      const exists = state.results.some(
        (candidate) => candidate._id === action.payload._id,
      );
      if (!exists) {
        state.results.push(action.payload);
      }
    },
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(
        (item) => item._id !== action.payload,
      );
    },
    clearSearchHistory: (state) => {
      state.results = [];
    },
  },
});

export const {
  setSearchHistory,
  clearSearchHistory,
  appendSearchHistory,
  removeFromSearchHistory,
} = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
