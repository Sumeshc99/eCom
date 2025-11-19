import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  otp: number;
  expiresAt: number;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true },
    otp: { type: Number, required: true },
    expiresAt: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOtp>("Otp", otpSchema);
