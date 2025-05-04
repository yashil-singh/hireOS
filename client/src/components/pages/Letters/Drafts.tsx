import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import DraftData from "@/assets/data/Drafts";
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
import { EllipsisVertical, Eye, Pen, Send, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "@/components/shared/ToolTip";

const Drafts = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );
  return (
    <>
      <h1 className="page-heading">Drafts</h1>
      <p className="page-description">
        Manage and customize reusable letter templates such as offer letters,
        rejection letters, and more. Drafts can be edited, previewed, and used
        to quickly issue letters to candidates.
      </p>

      <div
        className={cn(
          "mt-4 grid items-start gap-4",
          isSidebarCollapsed
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {DraftData.map((draft) => (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <CardTitle>{draft.title}</CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {format(new Date(draft.createdAt), DEFAULT_DATE_FORMAT)}
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
                        <Link to={`/letters/drafts/${draft.id}?edit=true`}>
                          <Pen /> Edit
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="text-destructive hover:text-destructive!">
                        <Trash2 className="text-destructive" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Label>Preview</Label>
              <ScrollArea className="bg-input/20 dark:bg-input/50 mt-2 h-24 overflow-clip rounded-xl">
                <div className="px-4 py-2">{draft.content}</div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="ghost" className="ml-auto" asChild>
                <Link to={`/letters/send?draft=${draft.id}`}>
                  <Send />
                  Use
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to={`/letters/drafts/${draft.id}`}>
                  <Eye />
                  View
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Drafts;
