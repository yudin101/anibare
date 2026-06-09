import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.object({
    searchTerm: z
      .string({ message: "Search term must be a text string" })
      .trim()
      .min(1, { message: "Anime name search term cannot be empty" })
      .max(100, { message: "Search term is too long" })
  })
});
