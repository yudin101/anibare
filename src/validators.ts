import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.object({
    searchTerm: z
      .string({ message: "Search term must be a text string" })
      .trim()
      .min(1, { message: "Anime name search term cannot be empty" })
      .max(100, { message: "Search term is too long" }),
  }),
});

export const sourcesRequestSchema = z.object({
  query: z.object({
    showId: z
      .string({ message: "Show ID must be a text string" })
      .trim()
      .min(1, { message: "Show ID cannot be empty" })
      .max(100, { message: "Show ID is too long" }),

    episodeNumber: z
      .string({ message: "Episode Number must be a string" })
      .trim()
      .min(1, { message: "Episode Number cannot be empty" })
      .max(100, { message: "Episode Number is too long" })
      .regex(/^\d+$/, { message: "Episode Number must contain only digits" }),

    episodeType: z.enum(["sub", "dub", "raw"], {
      message: "Episode type must be either 'sub', 'dub', or 'raw'",
    }),
  }),
});

export const episodesRequestSchema = z.object({
  query: z.object({
    showId: z
      .string({ message: "Show ID must be a text string" })
      .trim()
      .min(1, { message: "Show ID cannot be empty" })
      .max(100, { message: "Show ID is too long" }),
  }),
});

export const videoProxyRequestSchema = z.object({
  query: z.object({
    url: z
      .string({ message: "URL must be a string" })
      .trim()
      .refine(
        (val) => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "URL must be a valid HTTP URL" },
      ),
  }),
});
