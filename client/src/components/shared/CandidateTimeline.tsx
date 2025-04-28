import { HIRING_STEPS } from "@/lib/constants";
import { Event } from "@/lib/types";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Flag, Trophy, X } from "lucide-react";

const CandidateTimeline = ({ events }: { events: Event[] }) => {
  const isHired = events.some((event) => event.title.toLowerCase() === "hired");

  const buildTimeline = () => {
    const timeline = [];
    let hasRejected = false;
    const hasThirdInterview = events.some(
      (event) => event.title.toLowerCase() === "third interview",
    );

    for (const step of HIRING_STEPS) {
      // Skip all steps if rejected
      if (hasRejected) break;

      // Actual event and rejected case as well
      const currentEvent = events.find(
        (event) =>
          event.title === step || event.title.toLowerCase() === "rejected",
      );

      // if there is no third interview skip rendering it
      if (step.toLowerCase() === "third interview" && !hasThirdInterview) {
        continue;
      }

      if (currentEvent) {
        // Show rejected if current event is rejection event
        if (currentEvent.title.toLocaleLowerCase() === "rejected") {
          timeline.push({ label: "Rejected", status: "rejected" });
          hasRejected = true;
        } else {
          timeline.push({ label: currentEvent.title, status: "completed" });
        }
      } else {
        // future steps
        timeline.push({ label: step, status: "pending" });
      }
    }

    if (!hasRejected) {
      const rejectedEvent = events.find(
        (event) => event.title.toLowerCase() === "rejected",
      );

      if (rejectedEvent) {
        timeline.push({ label: "Rejected", status: "rejected" });
        hasRejected = true;
      }
    }

    return timeline;
  };

  return (
    <div className="relative mx-auto mt-5 flex w-full max-w-6xl flex-col items-center justify-between gap-5 text-center md:flex-row md:items-start md:gap-2">
      <div className="absolute top-[4%] bottom-[4%] z-0 rounded-full bg-black/10 max-md:w-0.5 md:top-2.5 md:right-[4%] md:left-[4%] md:h-0.5 dark:bg-white/10"></div>

      <div className="z-0 flex flex-col items-center">
        <Flag className="bg-card text-primary z-0" />
        <p className="mt-2 text-sm font-semibold">Start</p>
      </div>

      {buildTimeline().map((step, index) => (
        <div
          key={step.label + index}
          className="z-0 flex flex-col items-center"
        >
          <Badge
            variant={
              step.status === "completed"
                ? "default"
                : step.status === "rejected"
                  ? "destructive"
                  : "secondary"
            }
            className={cn(
              step.status !== "completed" &&
                step.status !== "rejected" &&
                "bg-muted text-muted-foreground",
            )}
          >
            {step.status === "rejected" ? (
              <X className="size-4!" />
            ) : (
              `Step ${index + 1}`
            )}
          </Badge>
          <p
            className={cn(
              "mt-2 text-sm font-semibold",
              step.status === "rejected" && "text-red-500",
              step.status !== "completed" &&
                step.status !== "rejected" &&
                "opacity-50",
            )}
          >
            {step.label}
          </p>
        </div>
      ))}

      <div className="z-0 flex flex-col items-center">
        <Trophy
          className={cn(
            "bg-card text-muted-foreground z-0",
            isHired && "text-primary",
          )}
        />
        <p
          className={cn(
            "text-muted-foreground mt-2 text-sm font-semibold",
            isHired && "text-foreground",
          )}
        >
          Hired
        </p>
      </div>
    </div>
  );
};

export default CandidateTimeline;
