import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "completed" | "pending" | "terminated";
}

const statusIconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Clock,
};

interface TimelineEventProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "success" | "warning" | "error" | "info";
  icon?: React.ReactNode;
}

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Timeline.displayName = "Timeline";

const TimelineEvent = React.forwardRef<HTMLDivElement, TimelineEventProps>(
  ({ className, status = "info", icon, children, ...props }, ref) => {
    const Icon = icon
      ? () => <>{icon}</>
      : statusIconMap[status] || statusIconMap.info;

    return (
      <div
        ref={ref}
        className={cn("relative ml-4 flex items-start gap-2 pt-3", className)}
        {...props}
      >
        <span className="text-muted-foreground mt-1 shrink-0">
          <Icon className="h-4 w-4" />
        </span>
        <div className="space-y-0.5">{children}</div>
      </div>
    );
  },
);
TimelineEvent.displayName = "TimelineEvent";

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.LiHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("group relative pb-8 pl-8 sm:pl-44", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, status = "pending", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "before:bg-muted mb-1 flex flex-col! items-start before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3 before:self-start before:px-px before:transition-colors group-last:before:hidden after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-4 after:transition-colors sm:flex-row sm:before:left-0 sm:before:ml-[10rem] sm:after:left-0 sm:after:ml-[10rem]",
        status === "completed"
          ? "after:border-green-500 after:bg-green-100"
          : status === "terminated"
            ? "before:bg-destructive after:border-destructive after:bg-red-100"
            : "after:border-muted-foreground after:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TimelineHeader.displayName = "TimelineHeader";

const TimelineTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-primary text-xl font-bold", className)}
    {...props}
  >
    {children}
  </div>
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineTime = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-muted-foreground left-0 mb-3 inline-flex h-6 w-36 translate-y-0.5 items-center justify-center text-xs font-semibold uppercase sm:absolute sm:mb-0",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
TimelineTime.displayName = "TimelineTime";

const TimelineDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineEvent,
  TimelineItem,
  TimelineHeader,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
};
