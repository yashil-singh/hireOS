import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface Candidate extends Document {
  _id: ObjectId;
  name: string;
  phone: string;
  email: string;
  level: string;
  technology: string[];
  reference: string;
  experience: Experience[];
  salaryExpectation: string;
  status: string;
  resumeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<Experience>({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  duration: { type: Number, required: true },
});

const candidateSchema = new Schema<Candidate>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    level: { type: String, required: true },
    technology: { type: [String], required: true, default: [] },
    reference: { type: String, required: false },
    experience: { type: [experienceSchema], required: false },
    salaryExpectation: { type: String, required: true },
    status: { type: String, required: true },
    resumeUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model<Candidate>("Candidate", candidateSchema);
export default Candidate;
