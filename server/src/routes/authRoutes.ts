import {
  googleCallback,
  googleOneTap,
  initiateGoogleLogin,
  login,
  logout,
  signup,
  userData,
} from "@/controllers/authController";
import { loginSchema, signupSchema } from "@/lib/schemas/authSchemas";
import { authenticate } from "@/middlewares/authenticate";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.get("/google", initiateGoogleLogin);
router.get("/google/callback", googleCallback);
router.post("/google/one-tap", googleOneTap);

router.post("/signup", validateData(signupSchema), signup);
router.post("/login", validateData(loginSchema), login);
router.post("/logout", logout);

router.get("/me", authenticate, userData);

export default router;
