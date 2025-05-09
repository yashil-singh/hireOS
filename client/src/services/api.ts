import { BASE_API_URL } from "@/lib/constants";
import { clearUser } from "@/lib/slices/session/sessionSlice";
import axios from "axios";
import { toast } from "sonner";
import { store } from "@/lib/slices/store";

// Axios instance
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// GET request
export const GET = async (endpoint: string = "", params?: URLSearchParams) => {
  const response = await api.get(endpoint, { params });
  return response.data;
};

export const POST = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.post(endpoint, body);
  return response.data;
};

export const PATCH = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.patch(endpoint, body);
  return response.data;
};

export const DELETE = async (endpoint: string = "") => {
  const response = await api.delete(endpoint);
  return response.data;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config?.url?.endsWith("/auth/me")) {
      const isAuthenticated = store.getState().session.isAuthenticated;

      if (isAuthenticated) {
        toast.error("You have been logged out.");
        store.dispatch(clearUser());
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject({
      message,
      status: err.response?.status,
      data: err.response?.data,
    });
  },
);
