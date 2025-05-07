import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IDraftVariable extends Document {
  _id: Types.ObjectId;
  key: string;
  label: string;
  description: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const draftVariableSchema = new Schema<IDraftVariable>(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String, required: false },
    isSystem: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const DraftVariable: Model<IDraftVariable> = mongoose.model<IDraftVariable>(
  "DraftVariable",
  draftVariableSchema
);

export default DraftVariable;
