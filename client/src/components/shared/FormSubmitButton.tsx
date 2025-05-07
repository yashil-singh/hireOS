import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

type FormSubmitButtonProps = {
  isSubmitting: boolean;
} & ButtonProps;

const FormSubmitButton = ({
  isSubmitting,
  className,
  ...props
}: FormSubmitButtonProps) => {
  return (
    <Button
      className={cn("w-full", className)}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting && <Loader2 className="animate-spin" />}
      {isSubmitting ? "Submitting" : "Submit"}
    </Button>
  );
};

export default FormSubmitButton;
