import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sideBarReducer from "@/lib/slices/sideBar/sideBarSlice";
import themeReducer from "@/lib/slices/theme/themeSlice";
import sessionReducer from "@/lib/slices/session/sessionSlice";
import hringProcessReducer from "@/lib/slices/hiringProcess/hiringProcessSlice";
import searchHistoryReducer from "@/lib/slices/searchHistory/searchHistorySlice";
import dataViewReducer from "@/lib/slices/dataView/dataViewSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sidebar", "theme", "searchHistory", "dataView"],
};

const rootReducer = combineReducers({
  sidebar: sideBarReducer,
  theme: themeReducer,
  session: sessionReducer,
  hiringProcess: hringProcessReducer,
  searchHistory: searchHistoryReducer,
  dataView: dataViewReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
