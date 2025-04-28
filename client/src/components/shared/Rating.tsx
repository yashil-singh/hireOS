import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type RatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
  starSize?: number;
  labelClassName?: string;
};

const Rating = ({
  value,
  onChange,
  max = 5,
  disabled,
  starSize = 24,
  labelClassName,
}: RatingProps) => {
  const handleClick = (newValue: number) => {
    if (disabled) return;

    if (newValue === value) {
      // If clicked on the same star, decrease rating by 1
      onChange(value - 1);
    } else {
      // Otherwise, set to the clicked value
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <b className={labelClassName}>{value}.0</b>

      <span className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < value;
          return (
            <Star
              key={i}
              size={starSize}
              className={cn(
                "stroke-primary cursor-pointer transition-colors",
                filled && "fill-primary",
                disabled && "cursor-default",
              )}
              onClick={() => handleClick(i + 1)}
            />
          );
        })}
      </span>
    </div>
  );
};

export default Rating;
