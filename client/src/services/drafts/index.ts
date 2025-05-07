import { GET, PATCH, POST } from "../api";
import {
  DraftFormValues,
  DraftVariableFormValues,
  MultiDraftResponse,
  MultiDraftVariableResponse,
  SingleDraftResponse,
  SingleDraftVariableResponse,
} from "./types";

const BASE = "/letters/drafts";

export const getAllDrafts = async (): Promise<MultiDraftResponse> => {
  const response = await GET(BASE);
  return response;
};

export const getDraftById = async (
  id: string,
): Promise<SingleDraftResponse> => {
  const response = await GET(`${BASE}/${id}`);
  return response;
};

export const createDraft = async (
  values: DraftFormValues,
): Promise<SingleDraftResponse> => {
  const response = await POST(BASE, values);
  return response;
};

export const editDraft = async (
  id: string,
  values: DraftFormValues,
): Promise<SingleDraftResponse> => {
  const response = await PATCH(`${BASE}/${id}`, values);
  return response;
};

export const createDraftVariable = async (
  values: DraftVariableFormValues,
): Promise<SingleDraftVariableResponse> => {
  const response = await POST(`${BASE}/variables`, values);
  return response;
};

export const getAllDraftVariables =
  async (): Promise<MultiDraftVariableResponse> => {
    const response = await GET(`${BASE}/variables`);
    return response;
  };
