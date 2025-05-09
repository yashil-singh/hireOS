import { Letter } from "@/services/letter/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVerticalIcon, FileEdit, Info, Trash2 } from "lucide-react";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import ToolTip from "../shared/ToolTip";
import { Link } from "react-router-dom";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import AccountAvatar from "../shared/AccountAvatar";

type LetterCardProps = {
  letter: Letter;
};

const LetterCard = ({ letter }: LetterCardProps) => {
  const { _id, candidate, content, createdAt, draft } = letter;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AccountAvatar avatarUrl={candidate.avatarUrl} />
              <span>
                <b>{candidate.name}</b>
                <p className="text-muted-foreground">{candidate.email}</p>
              </span>
            </div>

            <div className="space-y-1">
              <CardDescription>
                Sent on {format(new Date(createdAt), DEFAULT_DATE_FORMAT)}{" "}
              </CardDescription>
              <CardTitle className="flex items-center gap-2">
                Draft: {draft.title}
              </CardTitle>
            </div>
          </div>
          <DropdownMenu>
            <ToolTip label="More">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
            </ToolTip>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to={`/letters/drafts/${draft._id}`}>
                    <FileEdit /> Used Draft
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
        <ScrollArea className="bg-input/20 dark:bg-input/50 mt-2 h-32 overflow-clip rounded-xl">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="px-4 py-2"
          ></div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to={`/letters/${_id}`}>
            <Info />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LetterCard;
