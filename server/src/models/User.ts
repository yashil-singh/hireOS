import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  avatar?: string;
  provider: "google" | "github" | "default";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    avatar: { type: String },
    provider: {
      type: String,
      required: true,
      enum: ["google", "github", "default"],
      default: "default",
    },
  },
  {
    timestamps: true,
  }
);
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
