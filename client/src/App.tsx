import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useSelector } from "react-redux";
import { RootState } from "./lib/stores/store";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");

    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.add(systemPrefersDark ? "dark" : "");
    }

    if (theme === "dark") {
      root.classList.add("dark");
    }
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
