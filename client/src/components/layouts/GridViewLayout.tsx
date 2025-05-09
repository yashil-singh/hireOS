import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

const GridViewLayout = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );
  return (
    <div
      className={cn(
        "grid items-start gap-4",
        className,
        isSidebarCollapsed
          ? "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          : "xl:grid-cols-2 2xl:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
};

export default GridViewLayout;
