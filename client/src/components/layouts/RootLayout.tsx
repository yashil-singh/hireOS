import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { ScrollRestoration } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex">
      <ScrollRestoration />

      <Sidebar />

      <section className="w-full">
        <Header />

        <main className="p-4">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default RootLayout;
