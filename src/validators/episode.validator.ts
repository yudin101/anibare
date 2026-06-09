import { z } from "zod";

export const episodeRequestSchema = z.object({
  body: z.object({
    showId: z
      .string({ message: "Show ID must be a text string" })
      .trim()
      .min(1, { message: "Show ID cannot be empty" })
      .max(100, { message: "Show ID is too long" })
  })
});
