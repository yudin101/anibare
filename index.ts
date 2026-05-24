import { getEpisodes } from "./functions/episodes.js";
import { searchAnime } from "./functions/search.js";
import { getSourceUrls } from "./functions/sources.js";

// Searching for an anime
let searchResults = await searchAnime("attack on titan", { limit: 5 });
console.log(searchResults);

// for (const anime of searchResults) {
//   console.log(`[${anime._id}] ${anime.name}`);
//   console.log(
//     `  Episodes — sub: ${anime.availableEpisodes?.sub ?? 0}, dub: ${anime.availableEpisodes?.dub ?? 0}`,
//   );
//   console.log();
// }

// Finding information about anime
const show = searchResults[0];
const episodes = await getEpisodes(show!._id);
console.log(episodes);

// Finding source urls
const sourceUrls = await getSourceUrls(
  searchResults[0]!._id,
  episodes.sub[episodes.sub.length - 1]!,
  "sub",
);
console.log(sourceUrls);
