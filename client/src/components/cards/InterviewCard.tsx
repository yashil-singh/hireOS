import {
  Calendar,
  CalendarClock,
  Clock,
  EllipsisVertical,
  Info,
  Trash2,
} from "lucide-react";
import AccountAvatar from "../shared/AccountAvatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarEvent } from "@/services/calendar/types";
import { format } from "date-fns";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  interviewStatusColor,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import ToolTip from "../shared/ToolTip";
import { Link } from "react-router-dom";

type InterviewCardProps = {
  interview: CalendarEvent;
};

const InterviewCard = ({ interview }: InterviewCardProps) => {
  const { _id, title, start, end, candidate, status } = interview;

  const statusClass =
    interviewStatusColor[status as keyof typeof interviewStatusColor];

  const hasConcluded = status === "cancelled" || status === "completed";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AccountAvatar
                  avatarUrl={candidate.avatarUrl}
                  className="size-5"
                />
                <span>
                  <b>{candidate.name}</b> • {candidate.email}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="size-5" />
                  <span>{format(new Date(start), DEFAULT_DATE_FORMAT)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-5" />
                  <span>
                    {format(new Date(start), DEFAULT_TIME_FORMAT)} -{" "}
                    {format(new Date(end), DEFAULT_TIME_FORMAT)}
                  </span>
                </span>
              </div>
            </div>
            <Badge className={cn("capitalize", statusClass)}>{status}</Badge>
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
                <DropdownMenuItem className="text-destructive hover:text-destructive!">
                  <Trash2 className="text-destructive" /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!hasConcluded && (
          <Button disabled={hasConcluded} asChild>
            <Link to={`/letters/send?draft=${_id}`}>
              <CalendarClock />
              Reschedule
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to={`/interviews/${_id}`}>
            <Info />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
