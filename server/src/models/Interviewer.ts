import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the Interviewer interface
export interface IInterviewer extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Interviewer
const interviewerSchema = new Schema<IInterviewer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Interviewer: Model<IInterviewer> = mongoose.model<IInterviewer>(
  "Interviewer",
  interviewerSchema
);

export default Interviewer;
