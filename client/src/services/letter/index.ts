import { GET, POST } from "../api";
import {
  LetterFormValues,
  MultiLetterResponse,
  SingleLetterResponse,
} from "./types";

const BASE = "/letters";

export const getAllLetters = async (
  params?: URLSearchParams,
): Promise<MultiLetterResponse> => {
  const response = await GET(BASE, params);
  return response;
};

export const getLetterById = async (
  id: string,
): Promise<SingleLetterResponse> => {
  const response = await GET(`${BASE}/${id}`);
  return response;
};

export const sendLetter = async (
  data: LetterFormValues,
): Promise<SingleLetterResponse> => {
  const response = await POST(`${BASE}/send`, data);
  return response;
};
