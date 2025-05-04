import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import BackButton from "../shared/BackButton";
import { FilePen, Footprints, Lock } from "lucide-react";

const SettingsLayout = () => {
  const isMobile = useIsMobile();
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );
  const location = useLocation();
  const isIndex = location.pathname === "/settings";

  const showOnlyMenu = isMobile && isIndex;
  const hideMenu = isMobile && !isIndex;

  return (
    <div className="flex w-full gap-8 md:h-[85vh]">
      <section
        className={cn(
          "space-y-4 overflow-y-auto",
          showOnlyMenu
            ? "w-full"
            : isMobile
              ? hideMenu && "hidden w-0"
              : isSidebarCollapsed
                ? "w-[270px] lg:w-[320px]"
                : "w-[250px] xl:w-[280px]",
        )}
      >
        <h1 className="page-heading">Settings</h1>

        <div className="space-y-2">
          <NavLink
            to="/settings/hiring-process"
            className={({ isActive }) => cn("nav-link", isActive && "active")}
          >
            <Footprints />
            Hrinig Steps
          </NavLink>

          <NavLink
            to="/settings/templates"
            className={({ isActive }) => cn("nav-link", isActive && "active")}
          >
            <FilePen />
            Letter Drafts
          </NavLink>

          <NavLink
            to="/settings/change-password"
            className={({ isActive }) => cn("nav-link", isActive && "active")}
          >
            <Lock />
            Change Password
          </NavLink>
        </div>
      </section>

      {!isMobile && <Separator orientation="vertical" />}

      <section
        className={cn(
          "no-scrollbar h-full overflow-y-auto",
          showOnlyMenu ? "hidden w-0" : "flex-1",
        )}
      >
        <BackButton className="mb-4 md:hidden" />
        <Outlet />
      </section>
    </div>
  );
};

export default SettingsLayout;
