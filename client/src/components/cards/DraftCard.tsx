import { Draft } from "@/services/drafts/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ToolTip from "../shared/ToolTip";
import { Button } from "../ui/button";
import { EllipsisVertical, Info, Pen, Send, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "recharts";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";

type DraftCardProps = {
  draft: Draft;
};

const DraftCard = ({ draft }: DraftCardProps) => {
  const { _id, content, isDefault, isSystem, title, createdAt } = draft;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">{title}</CardTitle>
            <CardDescription>
              Created on {format(new Date(createdAt), DEFAULT_DATE_FORMAT)}{" "}
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
                  <Link to={`/letters/drafts/${_id}?edit=true`}>
                    <Pen /> Edit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive!"
                  disabled={isSystem}
                >
                  <Trash2 className="text-destructive" /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <Label>Preview</Label>
        <ScrollArea className="bg-input/20 dark:bg-input/50 mt-2 h-32 overflow-clip rounded-xl">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="px-4 py-2"
          ></div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div>
          {isDefault && <Badge>Default</Badge>}{" "}
          {isSystem && <Badge>Auto Generated</Badge>}
        </div>
        <div>
          <Button asChild>
            <Link to={`/letters/send?draft=${_id}`}>
              <Send />
              Use
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/letters/drafts/${_id}`}>
              <Info />
              Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DraftCard;
