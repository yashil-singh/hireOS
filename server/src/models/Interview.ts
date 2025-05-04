import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ICandidate } from "./Candidate";
import { IInterviewer } from "./Interviewer";

export interface IInterviewerFeedback {
  interviewer: IInterviewer;
  feedback: string;
}

export interface IInterview extends Document {
  title: string;
  event: Types.ObjectId;
  interviewers: Types.ObjectId[];
  candidate: ICandidate;
  status: "scheduled" | "completed" | "rescheduled" | "cancelled";
  feedbacks: IInterviewerFeedback[];
  start: Date;
  end: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    title: { type: String, required: true },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    interviewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Interviewer",
        required: true,
      },
    ],
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "rescheduled", "cancelled"],
      required: true,
      default: "scheduled",
    },
    feedbacks: [
      {
        interviewer: {
          type: Schema.Types.ObjectId,
          ref: "Interviewer",
          required: true,
        },
        feedback: { type: String, required: false },
      },
    ],
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { timestamps: true }
);

const Interview: Model<IInterview> = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);

export default Interview;
