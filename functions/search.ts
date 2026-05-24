import { ALLANIME_API, ALLANIME_REFERER, USER_AGENT } from "../constants.js";

const SEARCH_QUERY = `
  query(
    $search: SearchInput,
    $limit: Int,
    $page: Int,
    $translationType: VaildTranslationTypeEnumType,
    $countryOrigin: VaildCountryOriginEnumType
  ) {
    shows(
      search: $search
      limit: $limit
      page: $page
      translationType: $translationType
      countryOrigin: $countryOrigin
    ) {
      edges {
        _id
        name
        availableEpisodes
        __typename
      }
    }
  }
`;

export interface AnimeResult {
  _id: string;
  name: string;
  availableEpisodes: { sub: number; dub: number; raw: number } | null;
}

export async function searchAnime(
  query: string,
  options: {
    limit?: number;
    page?: number;
    translationType?: "sub" | "dub" | "raw";
    countryOrigin?: "JP" | "KR" | "CN" | "ALL";
  } = {},
): Promise<AnimeResult[]> {
  const {
    limit = 40,
    page = 1,
    translationType = "sub",
    countryOrigin = "ALL",
  } = options;

  const response = await fetch(ALLANIME_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      Referer: ALLANIME_REFERER,
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        search: {
          allowAdult: false,
          allowUnknown: false,
          query,
        },
        limit,
        page,
        translationType,
        countryOrigin,
      },
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

  return data.data.shows.edges as AnimeResult[];
}
