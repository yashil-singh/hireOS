import {
  changeCandidateStatus,
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidateById,
  getEligibleCandidates,
  updateCandidate,
} from "@/controllers/candidateController";
import { addCandidateSchema } from "@/lib/schemas/candidateSchemas";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.post("/", validateData(addCandidateSchema), createCandidate);

router.get("/", getAllCandidates);
router.get("/eligible", getEligibleCandidates);
router.get("/:id", getCandidateById);

router.patch("/:id", validateData(addCandidateSchema), updateCandidate);
router.patch("/:id/status", changeCandidateStatus);

router.delete("/:id", deleteCandidate);

export default router;
