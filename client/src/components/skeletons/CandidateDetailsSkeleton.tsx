import { Skeleton } from "../ui/skeleton";

const CandidateDetailsSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Skeleton className="h-[40px] max-w-[200px]" />
      <Skeleton className="h-[300px] w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[700px] md:col-span-2" />
        <Skeleton className="h-[350px]" />
      </div>
    </div>
  );
};

export default CandidateDetailsSkeleton;
