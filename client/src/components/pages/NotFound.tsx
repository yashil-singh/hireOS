import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { SearchingImage } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NotFound = ({
  className,
  item = "page",
  label,
  actionButton,
}: {
  className?: string;
  item?: string;
  label?: string;
  actionButton?: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex h-screen w-full flex-col items-center justify-center gap-8 p-12 md:flex-row md:gap-14",
        className,
      )}
    >
      <div className="dark:bg-foreground max-w-[450px] rounded-xl p-4">
        <img src={SearchingImage} alt="searching for page" />
      </div>

      <div className="flex flex-col items-center gap-6 md:items-start">
        <h1 className="text-primary text-4xl font-black md:text-6xl">Oops!</h1>

        <p className="text-muted-foreground max-w-[300px] text-center text-lg font-bold md:text-left md:text-2xl">
          {label ? label : `We couldn't find the ${item} you were looking for`}
        </p>

        {actionButton ? (
          actionButton
        ) : (
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft /> Go Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
