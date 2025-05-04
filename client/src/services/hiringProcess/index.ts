import { GET } from "../api";
import {
  GetAllHiringProcessStepsResponse,
  GetHiringProcessStepByIdResponse,
} from "./types";

export const getAllHiringProcessSteps =
  async (): Promise<GetAllHiringProcessStepsResponse> => {
    const response = await GET("/hiring-process");
    return response;
  };

export const getHiringProcessStepById = async (
  id: string,
): Promise<GetHiringProcessStepByIdResponse> => {
  const response = await GET(`/hiring-process/${id}`);
  return response;
};
