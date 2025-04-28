import {
  createAssessment,
  deleteAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByCandidateId,
  updatedAssessment,
} from "@/controllers/assessmentController";
import {
  addAssessmentSchema,
  updateAssessmentSchema,
} from "@/lib/schemas/assessmentSchemas";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.post("/", validateData(addAssessmentSchema), createAssessment);

router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.get("/candidate/:id", getAssessmentsByCandidateId);

router.patch("/:id", validateData(updateAssessmentSchema), updatedAssessment);

router.delete("/:id", deleteAssessment);

export default router;
