import {
  BASE_URL,
  CLIENT_BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/lib/constants";
import {
  comparePassword,
  generateToken,
  hashPassword,
  setCookieToken,
  successResponse,
  throwError,
} from "@/lib/utils";
import User from "@/models/User";
import { Request, Response } from "express";
import axios from "axios";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { AuthenticatedRequest } from "@/lib/types";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export const initiateGoogleLogin = (req: Request, res: Response) => {
  const redirect_uri = `${BASE_URL}/api/auth/google/callback`;

  const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;

  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(
    scope
  )}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return throwError("Authorization code is missing.");
  }

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

  const tokenResponse = await axios.post(tokenEndpoint, {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: `${BASE_URL}/api/auth/google/callback`,
    grant_type: "authorization_code",
  });

  const { access_token } = tokenResponse.data;

  const userInfoResponse = await axios.get(userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const userData = userInfoResponse.data;
  const { id, email, name, picture } = userData;

  const existingUser = await User.findOne({ email });

  let payload = { id: "", email: "" };

  if (existingUser) {
    if (existingUser.provider === "default")
      return throwError("Please use email and password to login.");

    payload = {
      id: (existingUser._id as string).toString(),
      email: existingUser.email,
    };
  } else {
    const newUser = new User({
      googleId: id,
      name,
      email,
      avatar: picture,
      provider: "google",
    });

    const user = await newUser.save();

    payload = {
      id: user._id as string,
      email: user.email,
    };
  }

  const token = await generateToken(payload);

  setCookieToken(res, token);

  res.redirect(CLIENT_BASE_URL);
};

export const googleOneTap = async (req: Request, res: Response) => {
  const { credential } = req.body;
  console.log("🚀 ~ authController.ts:109 ~ credential:", credential);

  const { payload } = await jwtVerify(credential, JWKS, {
    issuer: "https://accounts.google.com",
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });

  const {
    email,
    name,
    picture,
    sub: googleId,
  } = payload as {
    email: string;
    name: string;
    picture: string;
    sub: string;
  };

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      avatar: picture,
      googleId,
      provider: "google",
    });
  }

  const token = await generateToken({
    id: (user._id as string).toString(),
    email: user.email,
  });
  setCookieToken(res, token);

  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar ?? "",
  };

  successResponse({ res, message: "Logged in.", data });
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return throwError("An account assocciated with that email already exits.");

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();

  const payload = {
    id: (user._id as string).toString(),
    email: user.email,
  };

  const token = await generateToken(payload);

  setCookieToken(res, token);

  successResponse({ res, message: "Account created.", data: user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) return throwError("Account not found.", 404);

  if (existingUser.provider !== "default" || !existingUser.password)
    return throwError("Please log in using the provider you used previously.");

  const isValidPassword = await comparePassword(
    password,
    existingUser.password
  );

  if (!isValidPassword) return throwError("Invalid email or password.");

  const payload = {
    id: (existingUser._id as string).toString(),
    email: existingUser.email,
  };

  const token = await generateToken(payload);

  setCookieToken(res, token);

  const user = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    avatarUrl: existingUser.avatar ?? "",
  };

  successResponse({ res, message: "Logged in.", data: user });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse({ res, message: "Logged out." });
};

export const userData = async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");

  const user = (req as AuthenticatedRequest).user;
  successResponse({ res, data: user });
};
