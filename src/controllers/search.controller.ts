import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { searchAnime } from "../services/search.service";
import { searchRequestSchema } from "../validators/search.validator";

export const searchController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { searchTerm } = searchRequestSchema.shape.query.parse(req.query);

    const searchResults = await searchAnime(searchTerm);

    return res.status(200).json(searchResults);
  },
);
