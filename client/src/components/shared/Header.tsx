import {
  Laptop,
  LogOut,
  Moon,
  Pen,
  Search,
  Settings,
  Sidebar,
  Sun,
  SunMoon,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/stores/store";
import { toggleCollapse } from "@/lib/stores/sideBar/sideBarStore";
import MobileSidebar from "./MobileSidebar";
import {
  setDarkTheme,
  setLightTheme,
  setSystemTheme,
} from "@/lib/stores/theme/themeSlice";
import { Favicon } from "@/lib/constants";
import AccountAvatar from "./AccountAvatar";
import { Link } from "react-router-dom";
import LogoutDialog from "./LogoutDialog";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

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

        <Input
          placeholder="Search for CVs..."
          className="bg-background hidden w-full max-w-[300px] lg:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden" asChild>
            <Button variant="outline" size="icon">
              <Search className="header-icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px] px-3 pb-4">
            <DropdownMenuLabel>Search</DropdownMenuLabel>

            <Input placeholder="Search for CVs..." className="h-9" />

            <DropdownMenuLabel>Recent Searches</DropdownMenuLabel>

            <ul className="space-y-1">
              <li className="flex items-center justify-between px-2 text-sm">
                <button className="w-full text-left">Yashil</button>
                <button>
                  <X className="size-4" />
                </button>
              </li>
              <li className="flex items-center justify-between px-2 text-sm">
                <button className="w-full text-left">Yashil</button>
                <button>
                  <X className="size-4" />
                </button>
              </li>
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <DropdownMenuTrigger>
              <AccountAvatar avatarUrl="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="flex w-[250px] items-center gap-2 p-2">
                <AccountAvatar className="size-10" avatarUrl="" />
                <div>
                  <p className="font-medium">Yashil Lal Singh</p>
                  <p className="text-muted-foreground text-sm">
                    yashil@gmail.com
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/edit-profile">
                  <Pen className="size-5" /> Edit Profile
                </Link>
              </DropdownMenuItem>

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

          <LogoutDialog />
        </AlertDialog>
      </div>
    </header>
  );
};

export default Header;
