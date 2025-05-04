import { NavLinks } from "@/lib/constants";
import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <ul className={cn("flex flex-col gap-1", className)}>
        {NavLinks.map((link) => (
          <li key={link.title}>
            {showOnlyIcon ? (
              <Tooltip>
                <TooltipTrigger>
                  <NavLink
                    to={link.to}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                      cn(
                        "nav-link size-12 justify-center p-0",
                        isActive && "active",
                      )
                    }
                  >
                    <link.Icon className="size-6" />
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
            ) : link.hasChild ? (
              <Accordion type="single" defaultValue={link.title} collapsible>
                <AccordionItem value={link.title}>
                  <div className="flex items-center gap-2">
                    <NavLink
                      to={link.to}
                      end
                      className={({ isActive }) =>
                        cn("nav-link w-full", isActive && "active")
                      }
                      onClick={onLinkClick}
                    >
                      <link.Icon className="size-5" />
                      <span className="line-clamp-1">{link.title}</span>
                    </NavLink>
                    <AccordionTrigger></AccordionTrigger>
                  </div>
                  <AccordionContent className="mt-1 space-y-1 pb-0">
                    {link.children?.map((child) => (
                      <NavLink
                        to={child.to}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          cn("nav-link ml-6 p-2", isActive && "active")
                        }
                        key={`${link.title}-${child.title}`}
                        end
                      >
                        <child.Icon className="size-4" />
                        <span className="line-clamp-1">{child.title}</span>
                      </NavLink>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <NavLink
                to={link.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  cn("nav-link", isActive && "active")
                }
              >
                <link.Icon className="size-5" />

                <span className="line-clamp-1">{link.title}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
