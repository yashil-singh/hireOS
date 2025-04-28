import { NavLinks } from "@/lib/constants";
import { RootState } from "@/lib/stores/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = ({
  forSidebar = false,
  className,
  onLinkClick,
}: {
  forSidebar?: boolean;
  className?: string;
  onLinkClick?: () => void;
}) => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const showOnlyIcon = isCollapsed && forSidebar;

  return (
    <nav>
      <TooltipProvider>
        <ul className={cn("flex flex-col gap-1", className)}>
          {NavLinks.map((link) => (
            <li key={link.title}>
              <Tooltip delayDuration={500}>
                <TooltipTrigger className="w-full">
                  <NavLink
                    to={link.to}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                      cn(
                        "nav-link",
                        isActive && "active",
                        showOnlyIcon && "size-12 justify-center p-0",
                      )
                    }
                  >
                    <link.Icon
                      className={cn("size-5", showOnlyIcon && "size-6")}
                    />
                    {!showOnlyIcon && (
                      <span className="line-clamp-1">{link.title}</span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  side="right"
                  className={cn(!showOnlyIcon && "hidden")}
                >
                  <p>{link.title}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TooltipProvider>
    </nav>
  );
};

export default Navbar;
