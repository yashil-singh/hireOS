import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./lib/slices/store";
import { useEffect } from "react";
import { setIsDark } from "./lib/slices/theme/themeSlice";
import { authenticate } from "./services/auth";
import { clearUser, setUser } from "./lib/slices/session/sessionSlice";
import Loading from "./components/pages/Loading";
import { useQuery } from "@tanstack/react-query";
import { useGetAllHiringProcessSteps } from "./services/hiringProcess/queries";
import { setHiringProcess } from "./lib/slices/hiringProcess/hiringProcessSlice";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { loading } = useSelector((state: RootState) => state.session);

  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDark } = useSelector((state: RootState) => state.theme);

  const { data, isError, isFetched } = useQuery({
    queryKey: ["authenticate"],
    queryFn: authenticate,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { data: hiringProcessSteps, isLoading: hiringProcessStepsLoading } =
    useGetAllHiringProcessSteps();

  useEffect(() => {
    if (!isFetched) return;

    if (data) {
      dispatch(setUser(data.data));
    } else {
      if (isError) {
        dispatch(clearUser());
      }
    }
  }, [data, isError, isFetched, dispatch]);

  useEffect(() => {
    if (hiringProcessSteps) {
      dispatch(setHiringProcess(hiringProcessSteps.data));
    }
  }, [hiringProcessSteps, dispatch]);

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

  if (loading || hiringProcessStepsLoading) return <Loading />;

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        theme={isDark ? "dark" : "light"}
        toastOptions={{
          classNames: {
            success: "text-green-500!",
            error: "text-destructive!",
            info: "text-blue-500!",
            warning: "text-orange-500!",
            actionButton:
              "hover:bg-accent! text-foreground! border! border-border! bg-transparent! transition-colors! rounded-xl!",
          },
        }}
        closeButton
      />
    </>
  );
}

export default App;
