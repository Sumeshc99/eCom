import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
  phone?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
