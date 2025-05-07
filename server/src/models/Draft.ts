import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IDraftVariable } from "./DraftVariables";

export interface IDraft extends Document {
  _id: string;
  title: string;
  type: "offer" | "rejection" | "others";
  content: string;
  isSystem: boolean;
  isDefault: boolean;
  variables: IDraftVariable[];
  createdAt: Date;
  updatedAt: Date;
}

const draftSchema = new Schema<IDraft>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["offer", "rejection", "others"],
      required: true,
    },
    isSystem: { type: Boolean, required: true, default: false },
    isDefault: { type: Boolean, required: true, default: false },
    variables: [
      {
        type: Schema.Types.ObjectId,
        ref: "DraftVariable",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Draft: Model<IDraft> = mongoose.model<IDraft>("Draft", draftSchema);

export default Draft;
