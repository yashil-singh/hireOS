import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { LogOut, Sidebar } from "lucide-react";
import Navbar from "./Navbar";
import { Logo } from "@/lib/constants";
import LogoutDialog from "./LogoutDialog";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <Sidebar className="header-icon" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="pt-12">
          <SheetTitle className="hidden">Sidebar</SheetTitle>
          <SheetDescription className="hidden">
            This is a side bar for smaller devices
          </SheetDescription>

          <img src={Logo} className="h-8 object-contain" />
        </SheetHeader>

        <div className="flex h-full flex-col justify-between p-4">
          <Navbar onLinkClick={() => setOpen(false)} />

          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">
                  <LogOut className="size-5" /> Logout
                </Button>
              </AlertDialogTrigger>
              <LogoutDialog />
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
