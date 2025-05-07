import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { EllipsisVertical, Eye, Pen, Plus, Send, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "@/components/shared/ToolTip";
import SearchInput from "@/components/shared/SearchInput";
import { useState } from "react";
import { useGetAllDrafts } from "@/services/drafts/queries";
import CardLayoutSkeleton from "@/components/skeletons/CardLayoutSkeleton";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";
import BackButton from "@/components/shared/BackButton";
import { Badge } from "@/components/ui/badge";

const Drafts = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const {
    data: draftsData,
    isPending: draftsLoading,
    error: draftsError,
  } = useGetAllDrafts();

  if (draftsLoading) return <CardLayoutSkeleton />;

  if (!draftsData || draftsError) return <NotFound />;

  const { data: drafts } = draftsData;

  return (
    <>
      <BackButton />

      <h1 className="page-heading mt-4">Drafts</h1>
      <p className="page-description">
        Manage and customize reusable letter templates such as offer letters,
        rejection letters, and more. Drafts can be edited, previewed, and used
        to quickly issue letters to candidates.
      </p>

      <div className="mt-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          className="max-w-[500px] self-start"
          placeholder="Search for a draft using title or content..."
        />

        <Button asChild>
          <Link to="/letters/drafts/create">
            <Plus /> Add
          </Link>
        </Button>
      </div>

      {drafts.length > 0 ? (
        <div
          className={cn(
            "mt-4 grid items-start gap-4",
            isSidebarCollapsed
              ? "lg:grid-cols-3 xl:grid-cols-4"
              : "md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {drafts.map((draft) => (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {draft.title}
                    </CardTitle>
                    <CardDescription>
                      Created on{" "}
                      {format(
                        new Date(draft.createdAt),
                        DEFAULT_DATE_FORMAT,
                      )}{" "}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <ToolTip label="More">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                    </ToolTip>

                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link to={`/letters/drafts/${draft._id}?edit=true`}>
                            <Pen /> Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="text-destructive hover:text-destructive!"
                          disabled={draft.isSystem}
                        >
                          <Trash2 className="text-destructive" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  {draft.isDefault && <Badge>Default</Badge>}{" "}
                  {draft.isSystem && <Badge>Auto Generated</Badge>}
                </div>
              </CardHeader>

              <CardContent>
                <Label>Preview</Label>
                <ScrollArea className="bg-input/20 dark:bg-input/50 mt-2 h-32 overflow-clip rounded-xl">
                  <div
                    dangerouslySetInnerHTML={{ __html: draft.content }}
                    className="px-4 py-2"
                  ></div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="ghost" className="ml-auto" asChild>
                  <Link to={`/letters/send?draft=${draft._id}`}>
                    <Send />
                    Use
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to={`/letters/drafts/${draft._id}`}>
                    <Eye />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <NoData item="drafts" className="mt-4" />
      )}
    </>
  );
};

export default Drafts;
