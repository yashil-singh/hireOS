import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { RotateCw } from "lucide-react";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

type RetryButtonProps = {
  retrying: boolean;
} & ButtonProps;

const RetryButton = ({
  retrying,
  className,
  variant = "ghost",
  ...props
}: RetryButtonProps) => {
  return (
    <Button
      className={cn(className)}
      variant={variant}
      disabled={retrying}
      {...props}
    >
      <RotateCw className={cn(retrying && "animate-spin")} />
      {retrying ? "Retrying" : "Retry"}
    </Button>
  );
};

export default RetryButton;
