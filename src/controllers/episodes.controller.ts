import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { episodeRequestSchema } from "../validators/episode.validator";
import { getEpisodes } from "../services/episodes.service";

export const episodeController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { showId } = episodeRequestSchema.shape.body.parse(req.body);

    const episodes = await getEpisodes(showId);

    return res.status(200).json(episodes);
  },
);
