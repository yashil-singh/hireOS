import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
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

const userSchema = new Schema<User>(
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

userSchema.methods.isPassword = function (password: string): boolean {
  return this.provider === "form" && this.password === password;
};

const User = mongoose.model<User>("User", userSchema);
export default User;
