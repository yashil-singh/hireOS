import { BASE_URL } from "@/lib/constants";
import { Request, Response } from "express";

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
  console.log("🚀 ~ authController.ts:23 ~ code:", code);
  res.redirect(process.env.CLIENT_BASE_URL!);
};
