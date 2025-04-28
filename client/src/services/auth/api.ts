import { BASE_API_URL } from "@/lib/constants";

export const googleLogin = async () => {
  window.location.href = `${BASE_API_URL}/auth/google`;
};
