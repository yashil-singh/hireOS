import { Skeleton } from "../ui/skeleton";

const CardLayoutSkeleton = () => {
  return (
    <>
      <div className="flex flex-col items-end gap-8 md:flex-row">
        <div className="w-full flex-1 space-y-4 md:w-fit">
          <Skeleton className="h-[32px] w-full max-w-[170px]" />
          <Skeleton className="h-[24px] w-full max-w-[800px]" />
        </div>
      </div>
      <div className="my-4 flex items-center justify-between">
        <Skeleton className="h-[40px] w-full max-w-[500px]" />
        <Skeleton className="h-[40px] w-full max-w-[100px]" />
      </div>
      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Skeleton key={`card-skeleton-${num}`} className="h-[300px]" />
        ))}
      </div>
    </>
  );
};

export default CardLayoutSkeleton;
