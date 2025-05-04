import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const FormSubmitButton = ({
  isSubmitting,
  className,
}: {
  isSubmitting: boolean;
  className?: string;
}) => {
  return (
    <Button className={cn("w-full", className)} disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="animate-spin" />}
      {isSubmitting ? "Submitting" : "Submit"}
    </Button>
  );
};

export default FormSubmitButton;
