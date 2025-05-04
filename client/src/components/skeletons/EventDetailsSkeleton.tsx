import { Skeleton } from "../ui/skeleton";

const EventDetailsSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-[32px] w-full max-w-[170px]" />
        <Skeleton className="h-[24px] w-full max-w-[250px]" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-full md:max-w-[170px]" />
        <Skeleton className="h-12 w-full md:max-w-[125px]" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-full md:max-w-[170px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-full md:max-w-[170px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-full md:max-w-[170px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
