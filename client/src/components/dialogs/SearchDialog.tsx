import { Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SearchInput from "../shared/SearchInput";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="w-full max-w-[350px]">
          <Button variant="outline" size="icon" className="lg:hidden">
            <Search className="header-icon" />
          </Button>

          <div className="text-muted-foreground border-input hover:bg-accent hidden h-12 w-full cursor-pointer items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm transition-colors lg:flex">
            <Search className="size-5" />
            Search...
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="no-scrollbar bg-card flex h-[80vh] w-full max-w-2xl! flex-col gap-0 overflow-y-auto p-0"
        hideClose
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search for candidate profiles using name, email, technology, or
            status
          </DialogDescription>
        </DialogHeader>

        <span className="sticky top-0">
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            className="bg-card! rounded-none border-none shadow-none"
            placeholder="Search for candidate profiles using name, email, technology, or status..."
          />
          <Separator />
        </span>

        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground font-medium">Recent Searches</p>

            <Button variant="link" className="h-fit p-0">
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
