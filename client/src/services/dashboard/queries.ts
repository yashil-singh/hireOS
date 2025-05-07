import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from ".";
import { dashboardKeys } from "./keys";

export const useGetDashboardData = () => {
  return useQuery({
    queryFn: getDashboardData,
    queryKey: dashboardKeys.all(),
  });
};
