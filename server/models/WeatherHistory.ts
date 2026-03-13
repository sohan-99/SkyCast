import mongoose, { Schema } from "mongoose";

export interface IWeatherHistory extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  city: string;
  temperature: number;
  condition: string;
  searchedAt: Date;
}

const weatherHistorySchema = new Schema<IWeatherHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    city: { type: String, required: true, trim: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true },
    searchedAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

weatherHistorySchema.index({ userId: 1, searchedAt: -1 });

export const WeatherHistory =
  mongoose.models.WeatherHistory ||
  mongoose.model<IWeatherHistory>("WeatherHistory", weatherHistorySchema);
