import { Request, Response } from "express";
import { z } from "zod";
import axios from "axios";

import { catchAsync } from "./utils/catchAsync.util";

import { searchAnime } from "./services/search.service";
import { getSourceUrls } from "./services/sources.service";
import { getEpisodes } from "./services/episodes.service";

import {
  searchRequestSchema,
  episodesRequestSchema,
  sourcesRequestSchema,
  videoProxyRequestSchema,
} from "./validators";

type SearchQuery = z.infer<typeof searchRequestSchema>["query"];
export const searchController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { searchTerm } = req.query as SearchQuery;

    const searchResults = await searchAnime(searchTerm);

    return res.status(200).json(searchResults);
  },
);

type EpisodesQuery = z.infer<typeof episodesRequestSchema>["query"];
export const episodesController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { showId } = req.query as EpisodesQuery;

    const episodes = await getEpisodes(showId);

    return res.status(200).json({ showId, episodes });
  },
);

type SourcesQuery = z.infer<typeof sourcesRequestSchema>["query"];
export const sourcesController = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { showId, episodeNumber, episodeType } = req.query as SourcesQuery;

    const sourceUrls = await getSourceUrls(showId, episodeNumber, episodeType);

    // Taking only the URL with 7.9 priority
    const sevenNineUrl = sourceUrls.filter((s) => s.priority === 7.9);

    return res.status(200).json(sevenNineUrl[0]);
  },
);

type VideoProxySchema = z.infer<typeof videoProxyRequestSchema>["query"];
export const videoProxyController = catchAsync(
  async (req: Request, res: Response) => {
    const { url } = req.query as VideoProxySchema;

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
      Origin: "https://allmanga.to",
      Referer: "https://allmanga.to",
    };

    if (req.headers.range) {
      headers["Range"] = req.headers.range;
    }

    const response = await axios({
      method: "get",
      url: decodeURIComponent(url as string),
      responseType: "stream",
      headers,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 206,
    });

    res.set({
      "Content-Type": response.headers["content-type"] || "video/mp4",
      "Content-Range": response.headers["content-range"],
      "Accept-Ranges": response.headers["accept-ranges"] || "bytes",
      "Content-Length": response.headers["content-length"],
    });

    res.status(response.status);
    return response.data.pipe(res);
  },
);
