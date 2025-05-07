import dotenv from "dotenv";

dotenv.config();

export const BASE_URL = process.env.API_BASE_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
export const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL!;
export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
export const SALT = Number(process.env.SALT!);
export const JWT_SECRET = process.env.JWT_SECRET!;
export const SECRET = new TextEncoder().encode(JWT_SECRET);
export const ALG = "HS256";
export const JWT_EXPIRES_IN = "7d";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
export const DEFAULT_DATE_FORMAT = "do MMMM yyyy";
export const DEFAULT_TIME_FORMAT = "hh:mm a";
