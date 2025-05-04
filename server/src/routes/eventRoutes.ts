import {
  getEventsByCandidateId,
  getRecentEvents,
} from "@/controllers/eventsController";
import express from "express";

const router = express.Router();

router.get("/recent", getRecentEvents);
router.get("/candidate/:id", getEventsByCandidateId);

export default router;
