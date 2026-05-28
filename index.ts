import { getEpisodes } from "./functions/episodes.js";
import { resolveStreamLinks } from "./functions/resolveStreamLinks.js";
import { searchAnime } from "./functions/search.js";
import { decodeSourceUrl, getSourceUrls } from "./functions/sources.js";

// Searching for an anime
let searchResults = await searchAnime("blue lock", { limit: 5 });
// console.log(searchResults);

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
// console.log(episodes);

// Finding source urls
const sourceUrls = await getSourceUrls(
  searchResults[0]!._id,
  episodes.sub[episodes.sub.length - 1]!,
  "sub",
);

const clockUrls = sourceUrls
  .map((s) => decodeSourceUrl(s.sourceUrl))
  .filter((url) => url.includes("/apivtwo/clock"));

const validUrls = sourceUrls
  .map((s) => ({ ...s, decoded: decodeSourceUrl(s.sourceUrl) }))
  .filter((s) => s.decoded !== "https://allanime.day"); // filter out failed decodes only

// const allDecoded =  sourceUrls.map((s) => ({
//   sourceName: s.sourceName,
//   raw: s.sourceUrl,
//   decoded: decodeSourceUrl(s.sourceUrl),
// }))
// console.log(JSON.stringify(allDecoded, null, 2));

// for (const url of clockUrls) {
//   try {
//     const links = await resolveStreamLinks(url);
//     if (links.length > 0) {
//       console.log("Found links:", links);
//       break;
//     }
//   } catch (e) {
//     console.log("Failed:", url, (e as Error).message);
//   }
// }
console.log(clockUrls);
console.log(validUrls);
