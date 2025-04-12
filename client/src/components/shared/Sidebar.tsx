import { Favicon, Logo } from "@/lib/constants";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/stores/store";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Sidebar = () => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col justify-between border-r transition-all md:flex",
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You’ll need to sign in again
                to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};

export default Sidebar;
