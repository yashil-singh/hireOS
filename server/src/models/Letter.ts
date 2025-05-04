import mongoose, { Document, Schema, Types } from "mongoose";
import { ICandidate } from "./Candidate";
import { IDraft } from "./Draft";

export interface ILetter extends Document {
  candidate: ICandidate;
  draft: IDraft;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const letterSchema = new Schema<ILetter>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    draft: {
      type: Schema.Types.ObjectId,
      ref: "Draft",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Letter = mongoose.model<ILetter>("Letter", letterSchema);
export default Letter;
