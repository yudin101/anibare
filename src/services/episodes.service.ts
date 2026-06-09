import { ALLANIME_API, ALLANIME_REFERER, USER_AGENT } from "../config/constants.config.ts";

const EPISODES_QUERY = `
  query ($showId: String!) {
    show(_id: $showId) {
      _id
      availableEpisodesDetail
    }
  }
`;

export interface AnimeEpisodes {
  sub: string[];
  dub: string[];
  raw: string[];
}

export async function getEpisodes(showId: string): Promise<AnimeEpisodes> {
  const response = await fetch(ALLANIME_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      Referer: ALLANIME_REFERER,
    },
    body: JSON.stringify({
      query: EPISODES_QUERY,
      variables: { showId },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `AllAnime API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data.show.availableEpisodesDetail as AnimeEpisodes;
}
