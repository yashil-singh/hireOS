import { Moon, Search, Sidebar, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/stores/store";
import { toggleCollapse } from "@/lib/stores/sideBar/sideBarStore";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="blur-backdrop header-h sticky top-0 z-10 flex w-full items-center justify-between border-b px-4">
      <div className="flex w-full items-center gap-1 md:gap-2">
        <MobileSidebar />

        <Button
          size="icon"
          variant="outline"
          onClick={() => dispatch(toggleCollapse())}
          className="hidden md:flex"
        >
          <Sidebar className="header-icon" />
        </Button>

        <Input
          placeholder="Search for CVs..."
          className="bg-background hidden w-full max-w-[300px] md:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden" asChild>
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

      <div className="flex items-center gap-1">
        <Button size="icon" variant="outline">
          <Moon className="header-icon" />
        </Button>

        <Avatar className="size-12">
          <AvatarImage src="" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
