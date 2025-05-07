import { Response } from "express";
import mongoose from "mongoose";
import { ALG, COOKIE_MAX_AGE, JWT_EXPIRES_IN, SALT, SECRET } from "./constants";
import bcrypt from "bcryptjs";
import { JWTPayload } from "./types";
import { jwtVerify, SignJWT } from "jose";
import Candidate from "@/models/Candidate";

export const errorResponse = ({
  res,
  status = 400,
  message,
}: {
  res: Response;
  status?: number;
  message: string;
}) => {
  res.status(status).json({ success: false, message });
};

export const successResponse = ({
  res,
  status = 200,
  message,
  data,
}: {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
}) => {
  res.status(status).json({ success: true, message, data });
};

export const throwError = (message: string, statusCode: number = 400) => {
  const error = new Error(message);

  // @ts-ignore
  error.statusCode = statusCode;

  throw error;
};

export const isObjectId = (id: string) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT);

  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

export const createAuthPayload = (user: { _id: any; email: string }) => {
  return {
    id: user._id as string,
    email: user.email,
  };
};

export const generateToken = async (payload: JWTPayload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(SECRET);

  return token;
};

export const verifyToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify<JWTPayload>(token, SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};

export const setCookieToken = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
  });
};
