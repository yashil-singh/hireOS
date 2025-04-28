import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Assessment extends Document {
  _id: ObjectId;
  title: string;
  candidateId: ObjectId;
  fileUrl: string;
  evaluation: string;
}

const assessmentSchema = new Schema<Assessment>({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  candidateId: {
    type: Schema.ObjectId,
    ref: "Candidate",
    required: true,
  },
  evaluation: { type: String, required: true, default: "Not Graded" },
});

const Assessment = mongoose.model<Assessment>("Assessment", assessmentSchema);
export default Assessment;
