import { Search, X } from "lucide-react";
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
import { useSearchCandidates } from "@/services/candidates/queries";
import { Skeleton } from "../ui/skeleton";
import { useDebounce } from "use-debounce";
import NoData from "../shared/NoData";
import AccountAvatar from "../shared/AccountAvatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import {
  appendSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
} from "@/lib/slices/searchHistory/searchHistorySlice";
import { Badge } from "../ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();

  const searchHistory = useSelector(
    (state: RootState) => state.searchHistory.results,
  );
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Queries
  const { data, isPending, refetch } = useSearchCandidates(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      refetch();
    }
  }, [debouncedQuery, refetch]);

  useEffect(() => {
    setSearchQuery("");
  }, [open]);

  function highlightMatch(text: string): (string | React.ReactNode)[] {
    if (!searchQuery.trim()) return [text];

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = part.toLowerCase() === searchQuery.toLowerCase();

      return isMatch ? (
        <mark key={i} className="bg-secondary text-primary font-semibold">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  }

  const isLoading = isPending && searchQuery.trim().length > 0;

  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus={open}>
      <DrawerTrigger asChild>
        <div className="w-full max-w-[350px]">
          <Button variant="outline" size="icon" className="lg:hidden">
            <Search className="header-icon" />
          </Button>

          <div className="text-muted-foreground border-input hover:bg-accent hidden h-12 w-full cursor-pointer items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm transition-colors lg:flex">
            <Search className="size-5" />
            Search...
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="bg-card">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Search</DrawerTitle>
          <DrawerDescription className="sr-only">
            Search for candidate profiles using name, email, technology, or
            status
          </DrawerDescription>
          <span className="sticky top-0 z-10">
            <SearchInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              onClear={() => {
                setSearchQuery("");
                refetch();
              }}
              className="bg-card! shadow-none"
              placeholder="Search for candidate profiles using name, email, technology, or status..."
            />
          </span>
        </DrawerHeader>

        <div className="no-scrollbar bg-card flex h-[80vh] w-full max-w-2xl! flex-col gap-0 space-y-4 overflow-y-auto p-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
            </>
          ) : searchQuery.trim().length === 0 ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">Recent Searches</p>
                <Button
                  variant="link"
                  className="h-fit p-0"
                  onClick={() => dispatch(clearSearchHistory())}
                >
                  Clear
                </Button>
              </div>

              {searchHistory.length > 0 ? (
                searchHistory.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="hover:bg-accent flex w-full items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
                    onClick={() => {
                      navigate(`/candidates/${candidate._id}`);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <AccountAvatar />
                      <div className="flex flex-col items-start">
                        <div className="text-left">
                          <span>{candidate.name}</span> •{" "}
                          <span>{candidate.email}</span>
                        </div>
                        <span className="text-sm capitalize">
                          {candidate.level}
                        </span>
                        <span className="text-sm capitalize">
                          {candidate.status}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {candidate.technology.map((tech) => (
                            <Badge
                              className="capitalize"
                              variant="outline"
                              key={tech}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFromSearchHistory(candidate._id));
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  No recent searches.
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="font-medium">Search Results</h2>
              {(data?.data.length ?? 0 > 0) ? (
                data?.data.map((candidate) => (
                  <button
                    key={candidate._id}
                    className="hover:bg-accent flex w-full items-center gap-4 rounded-xl border p-4 transition-colors"
                    onClick={() => {
                      dispatch(appendSearchHistory(candidate));
                      navigate(`/candidates/${candidate._id}`);
                      onOpenChange(false);
                    }}
                  >
                    <AccountAvatar />
                    <div className="flex flex-col items-start">
                      <div className="text-left">
                        <span>{highlightMatch(candidate.name)}</span> •{" "}
                        <span>{highlightMatch(candidate.email)}</span>
                      </div>
                      <span className="text-sm capitalize">
                        {highlightMatch(candidate.level)}
                      </span>
                      <span className="text-sm capitalize">
                        {highlightMatch(candidate.status)}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        {candidate.technology.map((tech) => (
                          <Badge
                            className="capitalize"
                            variant="outline"
                            key={tech}
                          >
                            {highlightMatch(tech)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <NoData label="No results found." />
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
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

        <span className="sticky top-0 z-10">
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            onClear={() => {
              setSearchQuery("");
              refetch();
            }}
            className="bg-card! rounded-none border-none shadow-none"
            placeholder="Search for candidate profiles using name, email, technology, or status..."
          />
          <Separator />
        </span>

        <div className="space-y-4 p-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
            </>
          ) : searchQuery.trim().length === 0 ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">Recent Searches</p>
                <Button
                  variant="link"
                  className="h-fit p-0"
                  onClick={() => dispatch(clearSearchHistory())}
                >
                  Clear
                </Button>
              </div>

              {searchHistory.length > 0 ? (
                searchHistory.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="hover:bg-accent flex w-full items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
                    onClick={() => {
                      navigate(`/candidates/${candidate._id}`);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <AccountAvatar />
                      <div className="flex flex-col items-start">
                        <div className="text-left">
                          <span>{candidate.name}</span> •{" "}
                          <span>{candidate.email}</span>
                        </div>
                        <span className="text-sm capitalize">
                          {candidate.level}
                        </span>
                        <span className="text-sm capitalize">
                          {candidate.status}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {candidate.technology.map((tech) => (
                            <Badge
                              className="capitalize"
                              variant="outline"
                              key={tech}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFromSearchHistory(candidate._id));
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  No recent searches.
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="font-medium">Search Results</h2>
              {(data?.data.length ?? 0 > 0) ? (
                data?.data.map((candidate) => (
                  <button
                    key={candidate._id}
                    className="hover:bg-accent flex w-full items-center gap-4 rounded-xl border p-4 transition-colors"
                    onClick={() => {
                      dispatch(appendSearchHistory(candidate));
                      navigate(`/candidates/${candidate._id}`);
                      onOpenChange(false);
                    }}
                  >
                    <AccountAvatar />
                    <div className="flex flex-col items-start">
                      <div className="text-left">
                        <span>{highlightMatch(candidate.name)}</span> •{" "}
                        <span>{highlightMatch(candidate.email)}</span>
                      </div>
                      <span className="text-sm capitalize">
                        {highlightMatch(candidate.level)}
                      </span>
                      <span className="text-sm capitalize">
                        {highlightMatch(candidate.status)}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        {candidate.technology.map((tech) => (
                          <Badge
                            className="capitalize"
                            variant="outline"
                            key={tech}
                          >
                            {highlightMatch(tech)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <NoData label="No results found." />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
