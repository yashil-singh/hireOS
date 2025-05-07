import { Skeleton } from "../ui/skeleton";

const LetterSkeleton = () => {
  return (
    <div className="small-container space-y-4">
      <Skeleton className="h-[40px] w-full max-w-[350px]" />
      <Skeleton className="h-[40px] w-full max-w-[100px]" />

      <Skeleton className="h-[80vh] w-full" />
    </div>
  );
};

export default LetterSkeleton;
