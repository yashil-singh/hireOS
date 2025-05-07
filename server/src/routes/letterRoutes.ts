import {
  createDraft,
  createDraftVariable,
  deleteDraft,
  editDraft,
  getAllDrafts,
  getAllDraftVariables,
  getDraftById,
  getDraftVariableById,
} from "@/controllers/draftController";
import {
  getAllLetters,
  getLetterById,
  sendLetter,
} from "@/controllers/letterController";
import express from "express";

const router = express.Router();

router.get("/", getAllLetters);
router.get("/drafts", getAllDrafts);
router.get("/drafts/variables", getAllDraftVariables);
router.get("/drafts/variables/:id", getDraftVariableById);
router.get("/drafts/:id", getDraftById);
router.get("/:id", getLetterById);

router.post("/send", sendLetter);
router.post("/drafts", createDraft);
router.post("/drafts/variables", createDraftVariable);

router.patch("/drafts/:id", editDraft);

router.delete("/drafts/:id", deleteDraft);

export default router;
