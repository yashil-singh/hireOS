import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface IHiringProcess extends Document {
  _id: ObjectId;
  title: string;
  step: number;
  optional: boolean;
}

const hiringProcessSchema = new Schema<IHiringProcess>(
  {
    title: { type: String, required: true, unique: true },
    step: { type: Number, required: true, unique: true },
    optional: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const HiringProcess: Model<IHiringProcess> = mongoose.model<IHiringProcess>(
  "HiringProcess",
  hiringProcessSchema
);
export default HiringProcess;
