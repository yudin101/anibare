import { ALLANIME_API, ALLANIME_REFERER, USER_AGENT } from "../config/constants.config";
import { decryptTobeparsed } from "../utils/decrypt.util";

export interface SourceUrl {
  sourceUrl: string;
  sourceName: string;
  priority: number;
  sandbox: string;
  extraNote: string;
  downloads: unknown;
}

export async function getSourceUrls(
  showId: string,
  episode: string,
  translationType: "sub" | "dub" | "raw" = "sub",
): Promise<SourceUrl[]> {
  const QUERY_HASH =
    "d405d0edd690624b66baba3068e0edc3ac90f1597d898a1ec8db4e5c43c00fec";

  const variables = JSON.stringify({
    showId,
    translationType,
    episodeString: episode,
  });

  const extensions = JSON.stringify({
    persistedQuery: { version: 1, sha256Hash: QUERY_HASH },
  });

  const params = new URLSearchParams({ variables, extensions });

  const response = await fetch(`${ALLANIME_API}?${params}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Referer: ALLANIME_REFERER,
      Origin: ALLANIME_REFERER,
    },
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

  let sourceUrls: SourceUrl[];
  if (data.data?.tobeparsed) {
    const decrypted = decryptTobeparsed(data.data.tobeparsed);
    // parse the decrypted JSON — it contains the sourceUrls array
    const parsed = JSON.parse(decrypted);
    sourceUrls = parsed.episode.sourceUrls;
  } else if (data.data?.episode?.sourceUrls) {
    sourceUrls = data.data.episode.sourceUrls;
  } else {
    throw new Error("Unexpected response shape: " + JSON.stringify(data));
  }

  return sourceUrls;
}
