import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./lib/stores/store";
import { useEffect } from "react";
import { setIsDark } from "./lib/stores/theme/themeSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (systemPrefersDark) {
        root.classList.add("dark");
        dispatch(setIsDark(true));
      } else {
        root.classList.remove("dark");
        dispatch(setIsDark(false));
      }
    } else if (theme === "dark") {
      root.classList.add("dark");
      dispatch(setIsDark(true));
    } else {
      root.classList.remove("dark");
      dispatch(setIsDark(false));
    }
  }, [theme, dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
