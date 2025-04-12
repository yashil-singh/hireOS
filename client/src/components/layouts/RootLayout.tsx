import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";

const RootLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex h-screen w-full flex-col overflow-y-auto">
        <Header />

        <main className="h-full p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
