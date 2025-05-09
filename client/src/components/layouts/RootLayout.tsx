import { Navigate, Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { ScrollRestoration } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import ToTopButton from "../shared/ToTopButton";

const RootLayout = () => {
  const { user } = useSelector((state: RootState) => state.session);

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
