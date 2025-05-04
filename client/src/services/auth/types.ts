import { User } from "@/lib/slices/session/types";

export type GoogleOneTapLoginResponse = {
  message: string;
  data: User;
};

export type LoginResponse = {
  message: string;
  data: User;
};

export type SignupResponse = {
  message: string;
  data: User;
};

export type LogoutResponse = {
  message: string;
};

export type AuthenticateResponse = {
  data: User;
};
