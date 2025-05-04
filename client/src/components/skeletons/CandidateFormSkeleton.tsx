import { Skeleton } from "../ui/skeleton";

const CandidateFormSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-[32px] max-w-[170px]" />
        <Skeleton className="h-[24px] w-full" />
      </div>

      <Skeleton className="mt-8 h-[28px] max-w-[180px]" />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[48px]" />
        <Skeleton className="h-[48px]" />
        <Skeleton className="h-[48px]" />
        <Skeleton className="h-[48px]" />
      </div>
      <Skeleton className="h-[48px] w-full" />
      <Skeleton className="h-[48px] w-full" />

      <Skeleton className="mt-8 h-[28px] max-w-[180px]" />
      <Skeleton className="h-[48px] w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[48px]" />
        <Skeleton className="h-[48px]" />
      </div>
    </div>
  );
};

export default CandidateFormSkeleton;
