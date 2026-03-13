import { Request, Response } from "express";

import { User } from "../models/User";
import { WeatherHistory } from "../models/WeatherHistory";

export async function addFavoriteCity(req: Request, res: Response) {
  const { city } = req.body as { city: string };

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { $addToSet: { favoriteCities: city } },
    { new: true }
  ).select("favoriteCities");

  return res.json({ favoriteCities: user?.favoriteCities ?? [] });
}

export async function getFavoriteCities(req: Request, res: Response) {
  const user = await User.findById(req.user?.userId).select("favoriteCities");
  return res.json({ favoriteCities: user?.favoriteCities ?? [] });
}

export async function removeFavoriteCity(req: Request, res: Response) {
  const { city } = req.body as { city: string };

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { $pull: { favoriteCities: city } },
    { new: true }
  ).select("favoriteCities");

  return res.json({ favoriteCities: user?.favoriteCities ?? [] });
}

export async function getHistory(req: Request, res: Response) {
  const history = await WeatherHistory.find({ userId: req.user?.userId })
    .sort({ searchedAt: -1 })
    .limit(10)
    .select("city temperature condition searchedAt");

  return res.json({ history });
}
