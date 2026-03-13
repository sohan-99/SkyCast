import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  favoriteCities: string[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    favoriteCities: { type: [String], default: [] }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
