import { Event } from "@/lib/types";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Crown, Flag, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";

const CandidateTimeline = ({ events }: { events: Event[] }) => {
  const steps = useSelector((state: RootState) => state.hiringProcess.steps);
  const thridInterview = steps.find((step) => step.title.includes("third"));
  const isHired = events.some((event) => event.title.toLowerCase() === "hired");
  const hasThirdInterview = events.some(
    (event) => event.step?.title === thridInterview?.title,
  );
  const rejectionEventIndex = events.findIndex(
    (event) => event.title.toLowerCase() === "rejected",
  );
  const isRejected = rejectionEventIndex > -1;

  const buildTimeline = () => {
    const timeline = [];
    for (const step of steps) {
      if (step.title.toLowerCase() === "third-interview" && !hasThirdInterview)
        continue;

      const currentEvent = events.find((event) => event.step?._id === step._id);

      if (currentEvent) {
        timeline.push({ label: step.title, status: "completed" });

        if (isRejected && step.step === rejectionEventIndex + 1) {
          timeline.push({ label: "Rejected", status: "rejected" });
          break;
        }
      } else {
        if (isHired) continue;
        timeline.push({ label: step.title, status: "pending" });
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
              "mt-2 text-sm font-semibold capitalize",
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

      {!isRejected && (
        <div
          className={cn(
            "text-muted-foreground flex flex-col items-center gap-1 text-sm font-bold",
            isHired && "text-foreground",
          )}
        >
          <Crown className={cn(isHired && "text-primary")} /> Hired
        </div>
      )}
    </div>
  );
};

export default CandidateTimeline;
