import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";

type SearchInputProps = React.ComponentProps<"input"> & {
  onClear?: () => void;
  onValueChange?: (value: string) => void;
};

const SearchInput = ({
  className,
  placeholder,
  onClear,
  onValueChange,
  ...props
}: SearchInputProps) => {
  return (
    <div
      className={cn(
        "focus-visible:border-primary focus-visible:ring-primary/50 dark:bg-input/30 border-input flex h-12 w-full min-w-0 items-center gap-3 rounded-md border bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
    >
      <Search className="text-muted-foreground size-5" />

      <input
        className="selection:bg-primary placeholder:text-muted-foreground selection:text-primary-foreground h-full w-full appearance-none py-1 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="search"
        placeholder={placeholder ?? "Search..."}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />

      {props.value && (
        <Button
          type="button"
          variant="ghost"
          className="size-5"
          onClick={onClear}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
