import {
  assignAssessment,
  createAssessment,
  deleteAssessment,
  evaluateAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByCandidateId,
  updateAssessment,
} from "@/controllers/assessmentController";
import { assessmentSchema } from "@/lib/schemas/assessmentSchemas";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.post("/", validateData(assessmentSchema), createAssessment);
router.post("/:id/assign", assignAssessment);
router.post(
  "/:assessmentId/candidate/:candidateId/evaluate",
  evaluateAssessment
);

router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.get("/candidate/:id", getAssessmentsByCandidateId);

router.patch("/:id", validateData(assessmentSchema), updateAssessment);

router.delete("/:id", deleteAssessment);

export default router;
