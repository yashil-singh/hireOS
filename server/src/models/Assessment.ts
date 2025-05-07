import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import { ICandidate } from "./Candidate";
import { IInterviewer } from "./Interviewer";

export interface IAssignment extends Document {
  remarks?: string;
  rating?: number;
  status: "pending" | "evaluated";
  submissionFormat: "file" | "link";
  submissionLink: string;
  candidate: ICandidate;
  interviewer?: IInterviewer;
  deadlineDate: Date;
  deadlineTime: Date;
}

export interface IAssessment extends Document {
  title: string;
  description?: string;
  technologies: string[];
  assessmentType: string;
  format: "file" | "link";
  fileUrl?: string;
  link?: string;
  assignments: IAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    remarks: { type: String, required: false },
    rating: { type: Number, required: false },
    submissionFormat: {
      type: String,
      enum: ["file", "link"],
    },
    submissionLink: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "evaluated"],
      default: "pending",
      required: true,
    },
    candidate: {
      type: Schema.ObjectId,
      ref: "Candidate",
      required: true,
    },
    interviewer: {
      type: Schema.ObjectId,
      ref: "Interviewer",
      required: false,
    },
    deadlineDate: {
      type: Date,
      required: true,
    },
    deadlineTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const assessmentSchema = new Schema<IAssessment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    technologies: {
      type: [String],
      required: false,
      default: [],
    },
    assessmentType: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["file", "link"],
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    fileUrl: {
      type: String,
      required: false,
    },
    assignments: [assignmentSchema],
  },
  { timestamps: true }
);

const Assessment: Model<IAssessment> = mongoose.model<IAssessment>(
  "Assessment",
  assessmentSchema
);

export default Assessment;
