import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
} from "@/controllers/candidateController";
import { addCandidateSchema } from "@/lib/schemas/candidateSchemas";
import validateData from "@/middlewares/validateData";
import express from "express";

const router = express.Router();

router.post("/", validateData(addCandidateSchema), createCandidate);

router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);

router.patch("/:id", validateData(addCandidateSchema), updateCandidate);

router.delete("/:id", deleteCandidate);

export default router;
