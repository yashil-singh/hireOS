import { Skeleton } from "../ui/skeleton";

const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Skeleton className="h-[32px] w-full max-w-[170px]" />
        <Skeleton className="h-[24px] w-full" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-[80vh] md:col-span-2" />
        <Skeleton className="h-[500px]" />
      </div>
    </div>
  );
};

export default CalendarSkeleton;
