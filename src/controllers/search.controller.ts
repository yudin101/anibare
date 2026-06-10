import { Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../utils/catchAsync.util";
import { searchAnime } from "../services/search.service";
import { searchRequestSchema } from "../validators/search.validator";

type SearchQuery = z.infer<typeof searchRequestSchema>["query"];

export const searchController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { searchTerm } = req.query as SearchQuery;

    const searchResults = await searchAnime(searchTerm);

    return res.status(200).json(searchResults);
  },
);
