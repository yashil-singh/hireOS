import { Skeleton } from "../ui/skeleton";

const GridViewSkeleton = () => {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <Skeleton key={`card-skeleton-${num}`} className="h-[300px]" />
      ))}
    </div>
  );
};

export default GridViewSkeleton;
