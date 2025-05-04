import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { SearchingImage } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const NotFound = ({ label = "page" }: { label?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 p-12 md:flex-row md:gap-14">
      <div className="dark:bg-foreground max-w-[450px] rounded-xl p-4">
        <img src={SearchingImage} alt="searching for page" />
      </div>

      <div className="flex flex-col items-center gap-6 md:items-start">
        <h1 className="text-primary text-4xl font-black md:text-6xl">Oops!</h1>

        <p className="text-muted-foreground max-w-[300px] text-center text-lg font-bold md:text-left md:text-2xl">
          We couldn't find the {label} you were looking for
        </p>

        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
