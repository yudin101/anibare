import { Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../utils/catchAsync.util";
import { sourcesRequestSchema } from "../validators/sources.validator";
import { getSourceUrls } from "../services/sources.service";

type SourcesQuery = z.infer<typeof sourcesRequestSchema>["query"];

export const sourcesController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { showId, episodeNumber, episodeType } = req.query as SourcesQuery;

    const sourceUrls = await getSourceUrls(showId, episodeNumber, episodeType);

    // Taking only the URL with 7.9 priority
    const sevenNineUrl = sourceUrls.filter((s) => s.priority === 7.9); // filter out source with 7.9 priority

    return res.status(200).json(sevenNineUrl);
  },
);
