import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/services/calendar/types";
import { format } from "date-fns";
import { Bell, Calendar, Check, Clock, Info, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useSendInterviewReminder } from "@/services/calendar/mutations";

type CandidateInterviewCardProps = {
  event: CalendarEvent;
};

const CandidateInterviewCard = ({ event }: CandidateInterviewCardProps) => {
  const { mutateAsync, isPending } = useSendInterviewReminder();

  const { _id, title, status, end, event: parentEvent } = event;

  const isPassed = new Date() > new Date(end);
  const hasConcluded = status === "cancelled" || status === "completed";
  const isCancelled = parentEvent.status === "cancelled";

  return (
    <div key={event._id} className="border-b pb-4 last:border-b-0 last:pb-0">
      <b className="flex items-center gap-2 text-lg">
        {title}{" "}
        {!isCancelled && (
          <span
            className={cn(
              "flex items-center gap-1 text-sm capitalize",
              status === "completed" && "text-green-500",
              status === "cancelled" && "text-destructive",
              (status === "scheduled" || status === "rescheduled") &&
                "text-amber-500",
            )}
          >
            {status === "completed" && <Check className="size-4" />}
            {status === "cancelled" && <X className="size-4" />}
            {status === "rescheduled" ||
              (status === "scheduled" && <Clock className="size-4" />)}
            {status === "rescheduled" || status === "scheduled"
              ? "Pending"
              : status}
          </span>
        )}
      </b>
      <p className="text-muted-foreground flex items-center gap-1">
        <Calendar className="size-4" />
        {format(new Date(event.start), DEFAULT_DATE_FORMAT)}
      </p>
      <p className="text-muted-foreground flex items-center gap-1">
        <Clock className="size-4" />
        {format(new Date(event.start), DEFAULT_TIME_FORMAT)} -{" "}
        {format(new Date(event.end), DEFAULT_TIME_FORMAT)}
      </p>

      <div className="mt-4 flex flex-col items-center justify-end gap-2 md:flex-row">
        {!isCancelled && (
          <Button
            variant="outline"
            className="w-full md:max-w-[150px]"
            disabled={isPassed || hasConcluded || isPending || isCancelled}
            onClick={() => mutateAsync(event._id)}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> Sending
              </>
            ) : (
              <>
                <Bell /> Send Reminder
              </>
            )}
          </Button>
        )}

        <Button className="w-full md:w-fit" asChild>
          <Link to={`/calendar/event/${_id}`}>
            <Info /> Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CandidateInterviewCard;
