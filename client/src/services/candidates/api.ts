import { GET } from "../api";

export const getCandidates = async () => {
  const response = await GET("/candidates");
  return response;
};
