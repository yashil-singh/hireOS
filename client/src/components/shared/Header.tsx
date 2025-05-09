import {
  Laptop,
  LogOut,
  Moon,
  Settings,
  Sidebar,
  Sun,
  SunMoon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/slices/store";
import { toggleCollapse } from "@/lib/slices/sideBar/sideBarSlice";
import MobileSidebar from "./MobileSidebar";
import {
  setDarkTheme,
  setLightTheme,
  setSystemTheme,
} from "@/lib/slices/theme/themeSlice";
import { Favicon } from "@/lib/constants";
import AccountAvatar from "./AccountAvatar";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import LogoutAlert from "../dialogs/LogoutAlert";
import { useState } from "react";
import SearchDialog from "../dialogs/SearchDialog";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const user = useSelector((state: RootState) => state.session.user);

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="blur-backdrop header-h sticky top-0 z-10 flex w-full items-center justify-between border-b px-4">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <MobileSidebar />

        <Button
          size="icon"
          variant="outline"
          onClick={() => dispatch(toggleCollapse())}
          className="hidden lg:flex"
        >
          <Sidebar className="header-icon" />
        </Button>

        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </div>

      <img src={Favicon} className="h-8 lg:hidden" />

      <div className="flex w-full items-center justify-end gap-1 lg:w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              {theme === "dark" && <Moon className="header-icon" />}
              {theme === "light" && <Sun className="header-icon" />}
              {theme === "system" && <SunMoon className="header-icon" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => dispatch(setLightTheme())}
            >
              <Sun /> Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => dispatch(setDarkTheme())}
            >
              <Moon /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => dispatch(setSystemTheme())}
            >
              <Laptop /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
              <AccountAvatar avatarUrl={user?.avatarUrl} />
              <div className="hidden text-left text-sm lg:block">
                <p className="font-medium">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="flex w-[250px] items-center gap-1 p-2">
                <AccountAvatar
                  className="size-10"
                  avatarUrl={user?.avatarUrl}
                />
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="size-5" /> Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem className="text-destructive hover:text-destructive!">
                  <LogOut className="text-destructive size-5" /> Logout
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <LogoutAlert />
        </AlertDialog>
      </div>
    </header>
  );
};

export default Header;
