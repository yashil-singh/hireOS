import { Skeleton } from "../ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[400px]" />
            <Skeleton className="md:col-span-2" />
          </div>
        </div>

        <Skeleton />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
