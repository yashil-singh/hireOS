import { GET } from "../api";
import { DashboardDataResponse } from "./types";

const BASE = "/dashboard";

export const getDashboardData = async (): Promise<DashboardDataResponse> => {
  const response = await GET(BASE);
  return response;
};
