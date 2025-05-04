import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import { ICandidate } from "./Candidate";

export interface IFeeback extends Document {
  remarks: string;
  rating: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessment extends Document {
  title: string;
  candidate: ICandidate;
  assessmentType: "file" | "link";
  fileUrl?: string;
  link?: string;
  deadline: Date;
  feedbacks: IFeeback[];
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeeback>(
  {
    remarks: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const assessmentSchema = new Schema<IAssessment>(
  {
    title: {
      type: String,
      required: true,
    },
    assessmentType: {
      type: String,
      enum: ["file", "link"],
      required: true,
    },
    link: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    candidate: {
      type: Schema.ObjectId,
      ref: "Candidate",
      required: true,
    },
    deadline: { type: Date, required: true },
    feedbacks: [feedbackSchema],
  },
  { timestamps: true }
);

const Assessment: Model<IAssessment> = mongoose.model<IAssessment>(
  "Assessment",
  assessmentSchema
);

export default Assessment;
