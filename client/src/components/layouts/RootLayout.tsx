import { Navigate, Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { ScrollRestoration } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/slices/store";
import ToTopButton from "../shared/ToTopButton";
import { useGetAllHiringProcessSteps } from "@/services/hiringProcess/queries";
import { useEffect } from "react";
import { setHiringProcess } from "@/lib/slices/hiringProcess/hiringProcessSlice";
import Loading from "../pages/Loading";

const RootLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.session);

  const { data: hiringProcessSteps, isLoading: hiringProcessStepsLoading } =
    useGetAllHiringProcessSteps();

  useEffect(() => {
    if (hiringProcessSteps) {
      dispatch(setHiringProcess(hiringProcessSteps.data));
    }
  }, [hiringProcessSteps, dispatch]);

  if (hiringProcessStepsLoading) return <Loading />;

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <div className="flex">
      <ScrollRestoration />

      <Sidebar />

      <section className="w-full">
        <Header />

        <main className="p-4 pb-8">
          <Outlet />
        </main>
      </section>

      <ToTopButton />
    </div>
  );
};

export default RootLayout;
