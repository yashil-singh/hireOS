import { Skeleton } from "../ui/skeleton";

const SendLetterFormSkeleton = () => {
  return (
    <div className="small-container space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-[32px] max-w-[170px]" />
        <Skeleton className="h-[24px] w-full" />
      </div>

      <Skeleton className="h-[48px]" />
      <Skeleton className="h-[48px]" />
      <Skeleton className="h-[500px]" />
      <Skeleton className="h-[48px]" />
    </div>
  );
};

export default SendLetterFormSkeleton;
