import { Favicon, Logo } from "@/lib/constants";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/stores/store";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import LogoutDialog from "../dialogs/LogoutAlert";

const Sidebar = () => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  return (
    <aside
      className={cn(
        "sticky top-0 left-0 hidden h-screen flex-col justify-between border-r transition-all lg:flex",
        isCollapsed ? "w-20" : "w-96",
      )}
    >
      <section>
        <header className="header-h flex items-center border-b px-4">
          <img
            src={Logo}
            className={isCollapsed ? "hidden" : "hidden h-8 md:block"}
          />
          <img
            src={Favicon}
            className={isCollapsed ? "mx-auto h-8" : "h-8 md:hidden"}
          />
        </header>

        <div className="p-4">
          <Navbar forSidebar={true} />
        </div>
      </section>

      <div className="p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full">
              <LogOut className="size-5" />
              {!isCollapsed && "Logout"}
            </Button>
          </AlertDialogTrigger>
          <LogoutDialog />
        </AlertDialog>
      </div>
    </aside>
  );
};

export default Sidebar;
