import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  image: any;
  price: number;
  rating: string;
  description: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: Schema.Types.Mixed, required: true },
    price: { type: Number, required: true },
    rating: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Products", productSchema);
