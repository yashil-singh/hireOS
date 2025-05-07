import { NoDataImage } from "@/lib/constants";
import { cn } from "@/lib/utils";

type NoDataProps = {
  className?: string;
  imageClassName?: string;
  label?: string;
  item?: string;
  children?: React.ReactNode;
};

const NoData = ({
  className,
  imageClassName,
  label,
  item,
  children,
}: NoDataProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border-4 border-dashed p-8 text-center",
        className,
      )}
    >
      <img
        src={NoDataImage}
        className={cn("aspect-square w-full max-w-[400px]", imageClassName)}
      />
      <p className="text-muted-foreground">
        {label ? label : `There are currently no ${item ?? "data"}.`}
      </p>

      {children}
    </div>
  );
};

export default NoData;
