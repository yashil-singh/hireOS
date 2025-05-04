import { AuthenticatedRequest } from "@/lib/types";
import { throwError, verifyToken } from "@/lib/utils";
import User from "@/models/User";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    (req as AuthenticatedRequest).user = null;
    return throwError("Token not found", 401);
  }

  const validToken = await verifyToken(token);

  if (!validToken) {
    (req as AuthenticatedRequest).user = null;
    return throwError("Invalid or expired token.", 401);
  }

  const user = await User.findById(validToken.id).select("-password -__v");
  if (!user) return throwError("Invalid or expired token.", 401);

  const reqUser = {
    id: user._id as string,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar ?? "",
  };

  (req as AuthenticatedRequest).user = reqUser;
  next();
};
