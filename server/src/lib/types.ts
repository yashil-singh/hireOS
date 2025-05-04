import { User } from "@/models/User";
import { Request } from "express";

export type JWTPayload = {
  id: string;
  email: string;
};

export interface AuthenticatedRequest extends Request {
  user: { id: string; name: string; email: string; avatarUrl: string } | null;
}
