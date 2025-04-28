import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

const ToTopButton = () => {
  const { scrollToTop, isVisible } = useScrollToTop();

  return (
    isVisible && (
      <Button
        onClick={scrollToTop}
        className="fixed bottom-4 left-1/2 z-50 translate-x-1/2 transform rounded-full p-3"
        size="icon"
      >
        <ArrowUp className="size-5" />
      </Button>
    )
  );
};

export default ToTopButton;
