import { Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../utils/catchAsync.util";
import { episodesRequestSchema } from "../validators/episodes.validator";
import { getEpisodes } from "../services/episodes.service";

type EpisodesQuery = z.infer<typeof episodesRequestSchema>["query"];

export const episodesController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { showId } = req.query as EpisodesQuery;

    const episodes = await getEpisodes(showId);

    return res.status(200).json({ showId, episodes });
  },
);
