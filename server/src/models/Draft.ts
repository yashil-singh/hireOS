import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDraft extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const draftSchema = new Schema<IDraft>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Draft: Model<IDraft> = mongoose.model<IDraft>("Draft", draftSchema);

export default Draft;
