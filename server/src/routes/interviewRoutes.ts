import {
  getAllInterviews,
  getInterviewById,
  getInterviewsByCandidateId,
  markInterviewAsCompleted,
  rescheduleInterview,
  scheduleInterview,
  sendReminder,
} from "@/controllers/interviewController";
import validateParticipants from "@/middlewares/validateParticipants";
import express from "express";

const router = express.Router();

router.get("/events", getAllInterviews);
router.get("/events/:id", getInterviewById);
router.get("/events/candidate/:id", getInterviewsByCandidateId);

router.post("/schedule", validateParticipants, scheduleInterview);
router.patch(
  "/events/:id/reschedule/",
  validateParticipants,
  rescheduleInterview
);
router.post("/events/:id/remind", sendReminder);
router.patch("/events/:id/complete", markInterviewAsCompleted);

export default router;
