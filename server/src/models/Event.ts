import { IHiringProcess } from "@/models/HiringProcess";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ICandidate } from "./Candidate";

export interface IActivity extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent extends Document {
  _id: string;
  title: string;
  status: "pending" | "completed" | "cancelled";
  activities: IActivity[];
  candidate: ICandidate;
  step: IHiringProcess;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      required: true,
      default: "pending",
    },
    activities: [activitySchema],
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    step: {
      type: Schema.Types.ObjectId,
      ref: "HiringProcess",
      required: false,
    },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);
export default Event;
