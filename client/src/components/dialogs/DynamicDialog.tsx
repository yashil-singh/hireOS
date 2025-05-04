import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

type DynamicDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  showDescription?: boolean;
  showHeader?: boolean;
  children: React.ReactNode;
  showScrollTopButton?: boolean;
  className?: string;
};
const DynamicDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  showDescription = true,
  showHeader = true,
  children,
  showScrollTopButton = false,
  className,
}: DynamicDialogProps) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (open) {
      timeout = setTimeout(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
          if (container.scrollTop > 100) {
            setShowScrollTop(true);
          } else {
            setShowScrollTop(false);
          }
        };

        container.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
          container.removeEventListener("scroll", handleScroll);
        };
      }, 100); // Delay slightly to let DialogContent mount
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus={open}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <div
          ref={scrollRef}
          className={cn(
            "no-scrollbar mt-4 w-full space-y-4 overflow-y-auto p-4",
            className,
          )}
        >
          <DrawerHeader className={cn("p-0", !showHeader && "sr-only")}>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className={cn(!showDescription && "sr-only")}>
              {description}
            </DrawerDescription>
          </DrawerHeader>
          {children}

          {showScrollTopButton && showScrollTop && (
            <div className="absolute right-4 bottom-4 flex justify-end">
              <Button
                size="icon"
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <ArrowUp />
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn("w-full max-w-[600px]! px-0 py-0", className)}
      >
        <div
          ref={scrollRef}
          className="no-scrollbar max-h-[90vh] w-full space-y-4 overflow-y-auto p-4"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className={cn(!showDescription && "sr-only")}>
              {description}
            </DialogDescription>
          </DialogHeader>

          {children}

          {showScrollTopButton && showScrollTop && (
            <div className="absolute right-4 bottom-4 flex justify-end">
              <Button
                size="icon"
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <ArrowUp />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicDialog;
