import {
  googleCallback,
  initiateGoogleLogin,
} from "@/controllers/authController";
import express from "express";

const router = express.Router();

router.get("/google", initiateGoogleLogin);
router.get("/google/callback", googleCallback);

export default router;
