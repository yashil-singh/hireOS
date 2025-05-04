import { z } from "zod";
import { GET, POST } from "../api";
import { loginFormSchema, signupFormSceham } from "@/lib/schemas/authSchema";
import { BASE_API_URL } from "@/lib/constants";
import {
  AuthenticateResponse,
  GoogleOneTapLoginResponse,
  LoginResponse,
  LogoutResponse,
  SignupResponse,
} from "./types";
import { CredentialResponse } from "@react-oauth/google";

export const googleLogin = async () => {
  window.location.href = `${BASE_API_URL}/auth/google`;
};

export const googleOneTapLogin = async (
  credentialResponse: CredentialResponse,
): Promise<GoogleOneTapLoginResponse> => {
  const response = await POST("/auth/google/one-tap", {
    credential: credentialResponse.credential,
  });

  return response;
};

export const login = async (
  data: z.infer<typeof loginFormSchema>,
): Promise<LoginResponse> => {
  const response = await POST("/auth/login", data);

  return response;
};

export const signup = async (
  data: z.infer<typeof signupFormSceham>,
): Promise<SignupResponse> => {
  const response = await POST("/auth/signup", data);
  return response;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await POST("/auth/logout");
  return response;
};

export const authenticate = async (): Promise<AuthenticateResponse> => {
  const response = await GET("/auth/me");
  return response;
};
